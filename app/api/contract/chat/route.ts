import { NextRequest, NextResponse } from "next/server";
import { simpleChatAboutContract } from "@/lib/contract-analyzer";
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
    console.log("=== CHAT API: Request received ===");
    const body = await request.json();
    const { contractText, analysis, question } = body;

    console.log("Question:", question);
    console.log("Contract text length:", contractText?.length);
    console.log("Analysis provided:", !!analysis);

    // Validate inputs
    if (!contractText || typeof contractText !== "string") {
      console.error("❌ Contract text is required");
      return NextResponse.json(
        { error: "Contract text is required" },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string") {
      console.error("❌ Question is required");
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Parse analysis if provided
    const parsedAnalysis: ContractAnalysis | null = analysis || null;

    console.log("🤖 Starting chat with AI...");

    // Use simple (non-streaming) chat for more reliable responses
    const result = await simpleChatAboutContract(
      contractText,
      parsedAnalysis,
      question
    );

    console.log("✅ Chat response received");
    console.log("=== CHAT RESULT ===");
    console.log("Answer:", result.answer);
    console.log("Related Issues:", result.relatedIssues);
    console.log("Law References:", result.lawReferences);
    console.log("==================");

    // Return JSON response
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("=== CHAT API ERROR ===");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error("=====================");

    // Handle quota errors specifically
    if (isQuotaError(error) || isRetryError(error)) {
      return NextResponse.json(
        {
          error: "تم تجاوز حد API. يرجى الانتظار لحظة والمحاولة مرة أخرى.",
          errorType: "quota_exceeded",
          retryable: true,
        },
        { status: 429 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "فشل في معالجة طلب الدردشة",
        errorType: "server_error",
        retryable: false,
      },
      { status: 500 }
    );
  }
}
