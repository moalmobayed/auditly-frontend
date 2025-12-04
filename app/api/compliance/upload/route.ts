import { NextRequest, NextResponse } from "next/server";
import { processUploadedFile } from "@/lib/file-handler";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Process the uploaded file
    const projectStructure = await processUploadedFile(file);

    if (!projectStructure) {
      return NextResponse.json(
        { error: "Failed to process uploaded file" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      projectStructure,
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 }
    );
  }
}

