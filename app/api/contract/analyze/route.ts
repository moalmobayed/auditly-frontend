import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/contract-analyzer";
import { validateContractText } from "@/lib/contract-validation";

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
    const { contractText } = body;

    console.log("=== API ROUTE: /api/contract/analyze ===");
    console.log("Request received");
    console.log("Contract text length:", contractText?.length);
    console.log("Contract text type:", typeof contractText);
    console.log("=======================================");

    // Validate contract text
    if (!contractText || typeof contractText !== "string") {
      console.error("❌ Validation failed: Contract text is required");
      return NextResponse.json(
        { error: "Contract text is required" },
        { status: 400 }
      );
    }

    // Validate contract text content
    const validation = validateContractText(contractText);
    console.log("=== TEXT VALIDATION (API) ===");
    console.log("Valid:", validation.valid);
    console.log("Error:", validation.error);
    console.log("============================");
    
    if (!validation.valid) {
      console.error("❌ Validation failed:", validation.error);
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    console.log("✅ Starting AI analysis...");
    
    // Analyze contract
    const analysis = await analyzeContract(contractText);

    console.log("=== AI ANALYSIS COMPLETE (API) ===");
    console.log("Analysis result:", JSON.stringify(analysis, null, 2));
    console.log("Total issues:", analysis.summary.totalIssues);
    console.log("==================================");

    const response = {
      success: true,
      analysis,
    };

    console.log("✅ Sending successful response");
    return NextResponse.json(response);
  } catch (error) {
    console.error("=== CONTRACT ANALYSIS API ERROR ===");
    console.error("Error:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("===================================");

    // Handle quota errors specifically
    if (isQuotaError(error) || isRetryError(error)) {
      return NextResponse.json(
        {
          error:
            "API quota limit exceeded. Please try again in a few moments, or consider upgrading your API plan for higher limits.",
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
          error instanceof Error ? error.message : "Failed to analyze contract",
        errorType: "server_error",
        retryable: false,
      },
      { status: 500 }
    );
  }
}
