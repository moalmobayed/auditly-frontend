import { NextRequest, NextResponse } from "next/server";
import { analyzeCompliance } from "@/lib/ai-analyzer";
import { ProjectStructure, Store } from "@/types/compliance";
import { isAIConfigured } from "@/lib/ai-client";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout for analysis

export async function POST(request: NextRequest) {
  try {
    // Check if AI is configured
    if (!isAIConfigured()) {
      return NextResponse.json(
        {
          error:
            "AI service is not configured. Please set GOOGLE_AI_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { projectStructure, store } = body as {
      projectStructure: ProjectStructure;
      store: Store;
    };

    if (!projectStructure || !store) {
      return NextResponse.json(
        { error: "Missing required fields: projectStructure and store" },
        { status: 400 }
      );
    }

    // Perform analysis
    const result = await analyzeCompliance(projectStructure, store);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in compliance analysis:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during analysis",
      },
      { status: 500 }
    );
  }
}

