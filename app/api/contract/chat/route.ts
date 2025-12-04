import { NextRequest } from "next/server";
import { chatAboutContract } from "@/lib/contract-analyzer";
import { ContractAnalysis } from "@/types/contract";

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
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400 }
      );
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
    
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to process chat request",
      }),
      { status: 500 }
    );
  }
}
