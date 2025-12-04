import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/contract-handler-server";

// Configure route segment for large file uploads
export const maxDuration = 60; // Maximum duration in seconds
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log("=== API ROUTE: /api/contract/extract ===");
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    console.log("File received:", {
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });

    if (!file) {
      console.error("❌ No file provided");
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    console.log("🔍 Extracting text from file...");
    const startTime = Date.now();
    
    // Extract text from file
    const result = await extractTextFromFile(file);

    const duration = Date.now() - startTime;
    console.log(`⏱️ Extraction completed in ${duration}ms`);

    console.log("=== EXTRACTION RESULT ===");
    console.log("Success:", result.success);
    console.log("File Name:", result.fileName);
    console.log("File Size:", result.fileSize);
    if (result.success) {
      console.log("Extracted Text Length:", result.text?.length);
      console.log("Extracted Text Preview:", result.text?.substring(0, 500));
      console.log("Full Extracted Text:", result.text);
    } else {
      console.log("Error:", result.error);
    }
    console.log("========================");

    if (result.success) {
      const response = {
        success: true,
        text: result.text,
        fileName: result.fileName,
        fileSize: result.fileSize,
      };
      console.log("✅ Sending successful response");
      return NextResponse.json(response);
    } else {
      console.error("❌ Extraction failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          fileName: result.fileName,
          fileSize: result.fileSize,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("=== FILE EXTRACTION API ERROR ===");
    console.error("Error:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("=================================");
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("aborted") || error.message.includes("ECONNRESET")) {
        return NextResponse.json(
          {
            success: false,
            error: "Upload was interrupted. Please try again with a smaller file or check your connection.",
          },
          { status: 408 } // Request Timeout
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to extract text from file",
      },
      { status: 500 }
    );
  }
}

