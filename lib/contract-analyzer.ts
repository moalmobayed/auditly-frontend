import { generateObject, streamObject } from "ai";
import { getGeminiModel } from "./ai-client";
import {
  contractAnalysisSchema,
  chatResponseSchema,
  ContractAnalysis,
  ChatResponse,
  Severity,
} from "@/types/contract";

// System prompt for Egyptian law contract analysis
const EGYPTIAN_LAW_SYSTEM_PROMPT = `🏛 Digital AI Lawyer - Contract Review System

Your Role
You are an expert lawyer specializing in Egyptian law and technology company contracts. Your task is to meticulously review contracts and identify any legal conflicts or risks according to the Egyptian Constitution and related laws.

Core Instructions

1. Review Scope
Review the attached contract based on:
- Egyptian Constitution (2014 and amendments)
- Egyptian Civil Code
- Egyptian Commercial Code
- Personal Data Protection Law (151 of 2020)
- Cybercrime Law
- Egyptian Intellectual Property Laws
- Any other laws relevant to the nature of the contract

2. Focus Areas
Focus on:
- Clauses that violate the Constitution or Egyptian law
- Ambiguous or undefined clauses
- Legal loopholes in the contract
- Unbalanced rights and obligations
- Termination conditions and penalties
- Data protection and privacy
- Intellectual property
- Jurisdiction determination
- Applicable law

Analysis Requirements

For each issue you identify, you must provide:

🔴 Issue Title: Clear, descriptive title

📍 Location in Contract:
- Clause number (if available)
- Page number (if available)
- Quote the relevant clause text

⚠️ The Problem: Clear description of the legal issue

📜 Legal Basis:
- Violated Article number from Constitution/Law
- Article Text (relevant legal text)
- Interpretation: how the clause conflicts with the legal text

💥 Potential Impact: Explain legal and commercial consequences

✅ Recommendation: Specific suggestion to resolve the issue with alternative wording if possible

🔢 Priority Level: Critical/High/Medium/Low

Important Notes:
- Use precise legal terminology
- Quote texts verbatim from the contract and law
- Be specific in recommendations and provide practical alternative wording
- Classify risk levels objectively
- If no issues exist, state that clearly
- Maintain professional and objective tone throughout

Your analysis should help identify risks and provide actionable recommendations for contract improvement according to Egyptian law.`;

// Build analysis prompt
function buildAnalysisPrompt(contractText: string): string {
  return `Analyze the following contract according to Egyptian law. Identify all legal issues, violations, and areas of concern.

**Contract to Analyze:**
${contractText}

**Instructions:**
1. Carefully review the contract against Egyptian Civil Code, Commercial Code, and Labor Law
2. Classify issues by severity (Critical, High, Medium, Low)
3. For each issue, cite the specific Egyptian law article
4. Provide clear, actionable suggestions for compliance
5. Generate overall insights about the contract's legal standing
6. Provide recommendations for improvement

Focus on:
- Contract validity and enforceability
- Missing essential clauses required by Egyptian law
- Ambiguous or problematic terms
- Compliance with mandatory legal provisions
- Protection of parties' rights
- Potential legal risks

Provide a comprehensive analysis with structured output.`;
}

// Helper to extract meaningful error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for quota errors
    if (
      error.message.includes("quota") ||
      error.message.includes("RESOURCE_EXHAUSTED")
    ) {
      return "API quota limit exceeded";
    }
    // Check for retry errors
    if (error.name === "AI_RetryError") {
      const match = error.message.match(/Last error: (.+?)(?:\n|$)/);
      if (match) {
        return match[1];
      }
    }
    return error.message;
  }
  return "Unknown error occurred";
}

// Analyze contract with structured output
export async function analyzeContract(
  contractText: string
): Promise<ContractAnalysis> {
  try {
    console.log("=== ANALYZER: analyzeContract() ===");
    console.log("Contract text length:", contractText.length);
    console.log("Getting Gemini model...");

    const model = getGeminiModel();
    console.log("✅ Model obtained");

    const prompt = buildAnalysisPrompt(contractText);
    console.log("=== ANALYSIS PROMPT ===");
    console.log("Prompt:", prompt);
    console.log("======================");

    console.log("🤖 Calling AI SDK generateObject...");
    const startTime = Date.now();

    const { object } = await generateObject({
      model,
      schema: contractAnalysisSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: prompt,
      temperature: 0.3,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ AI analysis completed in ${duration}ms`);
    console.log("=== AI GENERATED OBJECT ===");
    console.log("Result:", JSON.stringify(object, null, 2));
    console.log("==========================");

    return object;
  } catch (error) {
    console.error("=== CONTRACT ANALYSIS ERROR ===");
    console.error("Error:", error);
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error("==============================");

    // Get meaningful error message
    const errorMessage = getErrorMessage(error);

    // Re-throw quota errors so they can be handled in the API route
    if (
      errorMessage.includes("quota") ||
      errorMessage.includes("RESOURCE_EXHAUSTED")
    ) {
      throw error;
    }

    // For other errors, return error result
    return {
      summary: {
        totalIssues: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        overallRisk: "critical",
      },
      issues: {
        critical: [],
        high: [],
        medium: [],
        low: [],
      },
      generalInsights: `Analysis failed: ${errorMessage}. Please try again.`,
      recommendations: ["Unable to generate recommendations at this time."],
    };
  }
}

// Build chat prompt with context
function buildChatPrompt(
  contractText: string,
  analysis: ContractAnalysis | null,
  question: string
): string {
  let prompt = `You are answering questions about a contract that has been analyzed according to Egyptian law.\n\n`;

  prompt += `**Contract Summary:**\n${contractText.substring(0, 2000)}${
    contractText.length > 2000 ? "..." : ""
  }\n\n`;

  if (analysis) {
    prompt += `**Previous Analysis Summary:**\n`;
    prompt += `- Total Issues: ${analysis.summary.totalIssues}\n`;
    prompt += `- Critical: ${analysis.summary.criticalCount}, High: ${analysis.summary.highCount}, Medium: ${analysis.summary.mediumCount}, Low: ${analysis.summary.lowCount}\n`;
    prompt += `- Overall Risk: ${analysis.summary.overallRisk}\n\n`;
    prompt += `**Key Insights:** ${analysis.generalInsights}\n\n`;
  }

  prompt += `**User Question:** ${question}\n\n`;
  prompt += `Please provide a detailed answer with relevant Egyptian law references, related issues from the analysis, and additional suggestions if applicable.`;

  return prompt;
}

// Chat about contract with structured streaming
export async function chatAboutContract(
  contractText: string,
  analysis: ContractAnalysis | null,
  question: string
) {
  try {
    const model = getGeminiModel();

    const result = await streamObject({
      model,
      schema: chatResponseSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: buildChatPrompt(contractText, analysis, question),
      temperature: 0.5,
    });

    return result;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
}

// Simple chat without structured output (fallback)
export async function simpleChatAboutContract(
  contractText: string,
  analysis: ContractAnalysis | null,
  question: string
): Promise<ChatResponse> {
  try {
    const model = getGeminiModel();

    const { object } = await generateObject({
      model,
      schema: chatResponseSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: buildChatPrompt(contractText, analysis, question),
      temperature: 0.5,
    });

    return object;
  } catch (error) {
    console.error("Simple chat error:", error);

    return {
      answer:
        "I apologize, but I encountered an error while processing your question. Please try again.",
      relatedIssues: [],
      lawReferences: [],
      additionalSuggestions: [],
    };
  }
}
