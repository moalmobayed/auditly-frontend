import { ScanResult } from "@/types/auditly";

const API_BASE_URL = "http://localhost:3001";

export async function uploadPackageJson(file: File): Promise<ScanResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/dependency-audit/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to upload file");
  }

  return response.json();
}
