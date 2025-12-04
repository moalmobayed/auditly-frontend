import { NextRequest, NextResponse } from "next/server";
import { analyzeContract } from "@/lib/contract-analyzer";
import { validateContractText } from "@/lib/contract-handler";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractText } = body;

    // Validate contract text
    if (!contractText || typeof contractText !== "string") {
      return NextResponse.json(
        { error: "Contract text is required" },
        { status: 400 }
      );
    }

    // Validate contract text content
    const validation = validateContractText(contractText);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Analyze contract
    const analysis = await analyzeContract(contractText);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Contract analysis API error:", error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to analyze contract",
      },
      { status: 500 }
    );
  }
}
