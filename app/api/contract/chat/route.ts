import { NextRequest } from "next/server";
import { chatAboutContract } from "@/lib/contract-analyzer";
import { ContractAnalysis } from "@/types/contract";

// Helper to check if error is a quota error
function isQuotaError(error: unknown): boolean {
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes("quota") ||
      errorMessage.includes("rate limit") ||
      errorMessage.includes("resource_exhausted") ||
      errorMessage.includes("429")
    );
  }
  return false;
}

// Helper to check if error is a retry error
function isRetryError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === "AI_RetryError" || error.message.includes("Failed after")
    );
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractText, analysis, question } = body;

    // Validate inputs
    if (!contractText || typeof contractText !== "string") {
      return new Response(
        JSON.stringify({ error: "Contract text is required" }),
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string") {
      return new Response(JSON.stringify({ error: "Question is required" }), {
        status: 400,
      });
    }

    // Parse analysis if provided
    const parsedAnalysis: ContractAnalysis | null = analysis || null;

    // Stream chat response
    const result = await chatAboutContract(
      contractText,
      parsedAnalysis,
      question
    );

    // Return streaming response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Contract chat API error:", error);

    // Handle quota errors specifically
    if (isQuotaError(error) || isRetryError(error)) {
      return new Response(
        JSON.stringify({
          error:
            "API quota limit exceeded. Please wait a moment and try again.",
          errorType: "quota_exceeded",
          retryable: true,
        }),
        { status: 429 }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to process chat request",
        errorType: "server_error",
        retryable: false,
      }),
      { status: 500 }
    );
  }
}
