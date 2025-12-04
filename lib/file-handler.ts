import JSZip from "jszip";
import { Platform, ProjectStructure } from "@/types/compliance";

// Detect platform from project structure
export function detectPlatform(files: Record<string, string>): Platform | null {
  const filePaths = Object.keys(files);

  // Check for Flutter
  if (filePaths.some((path) => path.includes("pubspec.yaml"))) {
    return Platform.Flutter;
  }

  // Check for React Native
  if (
    filePaths.some(
      (path) =>
        path.includes("package.json") &&
        files[path]?.includes("react-native")
    )
  ) {
    return Platform.ReactNative;
  }

  // Check for iOS
  if (
    filePaths.some(
      (path) => path.includes("Info.plist") || path.includes(".xcodeproj")
    )
  ) {
    return Platform.iOS;
  }

  // Check for Android
  if (
    filePaths.some(
      (path) =>
        path.includes("AndroidManifest.xml") || path.includes("build.gradle")
    )
  ) {
    return Platform.Android;
  }

  return null;
}

// Extract files from ZIP
export async function extractZipFile(file: File): Promise<Record<string, string>> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const files: Record<string, string> = {};

  // Only extract text files and relevant config files
  const relevantExtensions = [
    ".xml",
    ".plist",
    ".gradle",
    ".yaml",
    ".yml",
    ".json",
    ".java",
    ".kt",
    ".swift",
    ".m",
    ".h",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".dart",
  ];

  for (const [path, zipEntry] of Object.entries(contents.files)) {
    // Skip directories and hidden files
    if (zipEntry.dir || path.startsWith(".") || path.includes("/.")) {
      continue;
    }

    // Skip node_modules, build folders, etc.
    if (
      path.includes("node_modules/") ||
      path.includes("build/") ||
      path.includes("dist/") ||
      path.includes(".gradle/") ||
      path.includes("Pods/")
    ) {
      continue;
    }

    // Check if file is relevant
    const isRelevant = relevantExtensions.some((ext) =>
      path.toLowerCase().endsWith(ext)
    );

    if (isRelevant) {
      try {
        const content = await zipEntry.async("text");
        files[path] = content;
      } catch (error) {
        console.warn(`Failed to extract ${path}:`, error);
      }
    }
  }

  return files;
}

// Extract config files from project structure
export function extractConfigFiles(files: Record<string, string>) {
  const configFiles: ProjectStructure["configFiles"] = {};

  for (const [path, content] of Object.entries(files)) {
    const lowerPath = path.toLowerCase();

    if (lowerPath.includes("androidmanifest.xml")) {
      configFiles.manifest = content;
    } else if (lowerPath.includes("build.gradle")) {
      if (!configFiles.buildConfig) {
        configFiles.buildConfig = content;
      }
    } else if (lowerPath.includes("info.plist")) {
      configFiles.plist = content;
    } else if (lowerPath.includes("podfile") && !lowerPath.includes(".lock")) {
      configFiles.podfile = content;
    } else if (lowerPath.includes("package.json")) {
      configFiles.packageJson = content;
    } else if (lowerPath.includes("pubspec.yaml")) {
      configFiles.pubspec = content;
    }
  }

  return configFiles;
}

// Process uploaded file or folder
export async function processUploadedFile(
  file: File
): Promise<ProjectStructure | null> {
  let files: Record<string, string> = {};

  // Handle ZIP files
  if (file.name.endsWith(".zip")) {
    files = await extractZipFile(file);
  }
  // Handle single config files
  else if (
    file.name.endsWith(".xml") ||
    file.name.endsWith(".plist") ||
    file.name.endsWith(".gradle") ||
    file.name.endsWith(".yaml") ||
    file.name.endsWith(".json")
  ) {
    const content = await file.text();
    files[file.name] = content;
  } else {
    throw new Error(
      "Unsupported file type. Please upload a ZIP file or a supported config file."
    );
  }

  const platform = detectPlatform(files);
  if (!platform) {
    throw new Error(
      "Could not detect platform. Please ensure your project contains recognizable configuration files."
    );
  }

  const configFiles = extractConfigFiles(files);

  return {
    platform,
    files,
    configFiles,
  };
}

// Get relevant files for analysis (limit to important files)
export function getRelevantFilesForAnalysis(
  projectStructure: ProjectStructure
): Record<string, string> {
  const relevantFiles: Record<string, string> = {};

  // Always include config files
  for (const [key, content] of Object.entries(
    projectStructure.configFiles
  )) {
    if (content) {
      relevantFiles[key] = content;
    }
  }

  // Include important source files based on platform
  const importantPatterns = [
    "MainActivity",
    "AppDelegate",
    "SceneDelegate",
    "App.tsx",
    "App.jsx",
    "main.dart",
    "permissions",
    "privacy",
  ];

  for (const [path, content] of Object.entries(projectStructure.files)) {
    const shouldInclude = importantPatterns.some((pattern) =>
      path.includes(pattern)
    );

    if (shouldInclude) {
      relevantFiles[path] = content;
    }
  }

  return relevantFiles;
}

