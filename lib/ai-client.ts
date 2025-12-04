import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Initialize Google AI client
export function getGoogleAIClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GOOGLE_AI_API_KEY is not set in environment variables. Please add it to your .env.local file."
    );
  }

  return createGoogleGenerativeAI({
    apiKey,
  });
}

// Get the Gemini model for code analysis
export function getGeminiModel() {
  const google = getGoogleAIClient();
  // Using Gemini 1.5 Pro for comprehensive code analysis
  return google("gemini-1.5-pro-latest");
}

// Helper to check if AI is configured
export function isAIConfigured(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY;
}

