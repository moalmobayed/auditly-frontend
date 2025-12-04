import { ProjectStructure } from "@/types/compliance";

export interface FetchRepoOptions {
  url: string;
  branch?: string;
  token?: string;
}

export interface FetchRepoResult {
  success: boolean;
  projectStructure?: ProjectStructure;
  error?: string;
}

// Validate repository URL
export function validateRepoUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validHosts = [
      "github.com",
      "gitlab.com",
      "bitbucket.org",
    ];

    // Check for known hosts or any .git URL
    return (
      validHosts.some((host) => urlObj.hostname.includes(host)) ||
      url.endsWith(".git")
    );
  } catch {
    return false;
  }
}

// Parse repository info from URL
export function parseRepoUrl(url: string): {
  provider: string;
  owner: string;
  repo: string;
} | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    if (pathParts.length < 2) {
      return null;
    }

    let provider = "unknown";
    if (urlObj.hostname.includes("github.com")) {
      provider = "github";
    } else if (urlObj.hostname.includes("gitlab.com")) {
      provider = "gitlab";
    } else if (urlObj.hostname.includes("bitbucket.org")) {
      provider = "bitbucket";
    }

    const owner = pathParts[0];
    let repo = pathParts[1];

    // Remove .git extension if present
    if (repo.endsWith(".git")) {
      repo = repo.slice(0, -4);
    }

    return { provider, owner, repo };
  } catch {
    return null;
  }
}

// Fetch repository contents via API
export async function fetchRepositoryContents(
  options: FetchRepoOptions
): Promise<FetchRepoResult> {
  const { url, branch = "main" } = options;

  if (!validateRepoUrl(url)) {
    return {
      success: false,
      error: "Invalid repository URL",
    };
  }

  try {
    // Call backend API to fetch repository
    const response = await fetch("/api/compliance/fetch-repo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        branch,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || "Failed to fetch repository",
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching repository:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch repository",
    };
  }
}

// Get GitHub raw file URL
export function getGitHubRawUrl(
  owner: string,
  repo: string,
  path: string,
  branch: string = "main"
): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

// Get GitLab raw file URL
export function getGitLabRawUrl(
  owner: string,
  repo: string,
  path: string,
  branch: string = "main"
): string {
  return `https://gitlab.com/${owner}/${repo}/-/raw/${branch}/${path}`;
}

// Fetch specific files from repository
export async function fetchFilesFromRepo(
  repoUrl: string,
  filePaths: string[],
  branch: string = "main"
): Promise<Record<string, string>> {
  const repoInfo = parseRepoUrl(repoUrl);
  if (!repoInfo) {
    throw new Error("Invalid repository URL");
  }

  const files: Record<string, string> = {};
  const { provider, owner, repo } = repoInfo;

  for (const path of filePaths) {
    try {
      let rawUrl: string;

      if (provider === "github") {
        rawUrl = getGitHubRawUrl(owner, repo, path, branch);
      } else if (provider === "gitlab") {
        rawUrl = getGitLabRawUrl(owner, repo, path, branch);
      } else {
        console.warn(`Unsupported provider: ${provider}`);
        continue;
      }

      const response = await fetch(rawUrl);
      if (response.ok) {
        const content = await response.text();
        files[path] = content;
      }
    } catch (error) {
      console.warn(`Failed to fetch ${path}:`, error);
    }
  }

  return files;
}

