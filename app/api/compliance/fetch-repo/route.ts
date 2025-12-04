import { NextRequest, NextResponse } from "next/server";
import {
  validateRepoUrl,
  parseRepoUrl,
  fetchFilesFromRepo,
} from "@/lib/source-fetcher";
import { detectPlatform, extractConfigFiles } from "@/lib/file-handler";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, branch = "main" } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    if (!validateRepoUrl(url)) {
      return NextResponse.json(
        { success: false, error: "Invalid repository URL" },
        { status: 400 }
      );
    }

    const repoInfo = parseRepoUrl(url);
    if (!repoInfo) {
      return NextResponse.json(
        { success: false, error: "Could not parse repository URL" },
        { status: 400 }
      );
    }

    // List of important files to fetch
    const filesToFetch = [
      "AndroidManifest.xml",
      "app/src/main/AndroidManifest.xml",
      "android/app/src/main/AndroidManifest.xml",
      "build.gradle",
      "app/build.gradle",
      "android/app/build.gradle",
      "Info.plist",
      "ios/Info.plist",
      "ios/Runner/Info.plist",
      "Podfile",
      "ios/Podfile",
      "package.json",
      "pubspec.yaml",
    ];

    // Fetch files from repository
    const files = await fetchFilesFromRepo(url, filesToFetch, branch);

    if (Object.keys(files).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No configuration files found in repository. Please ensure the repository contains a mobile app project.",
        },
        { status: 404 }
      );
    }

    // Detect platform
    const platform = detectPlatform(files);
    if (!platform) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not detect platform from repository files",
        },
        { status: 400 }
      );
    }

    // Extract config files
    const configFiles = extractConfigFiles(files);

    return NextResponse.json({
      success: true,
      projectStructure: {
        platform,
        files,
        configFiles,
      },
    });
  } catch (error) {
    console.error("Error fetching repository:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch repository",
      },
      { status: 500 }
    );
  }
}

