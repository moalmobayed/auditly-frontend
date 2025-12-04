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
const EGYPTIAN_LAW_SYSTEM_PROMPT = `You are an expert legal analyst specializing in Egyptian law, particularly in contract law, civil law, and commercial law. Your expertise includes:

**Egyptian Legal Framework:**
- Egyptian Civil Code (Law No. 131 of 1948)
- Egyptian Commercial Code (Law No. 17 of 1999)
- Egyptian Labor Law (Law No. 12 of 2003)
- Contract Law principles under Egyptian jurisdiction

**Your Role:**
Analyze contracts for compliance with Egyptian law, identifying:
1. **Critical Issues**: Violations that make the contract void or unenforceable
2. **High Issues**: Serious violations that could lead to legal disputes
3. **Medium Issues**: Concerns that should be addressed for better compliance
4. **Low Issues**: Minor improvements and best practice recommendations

**Analysis Focus:**
- Contract formation and validity (Articles 89-100 of Civil Code)
- Consent and contractual capacity (Articles 54-88)
- Contractual obligations and performance (Articles 147-163)
- Contract termination and breach (Articles 157-163)
- Penalty clauses and liquidated damages (Article 223)
- Limitation periods (Articles 374-388)
- Commercial contracts specifics (Commercial Code)
- Labor contracts compliance (Labor Law)
- Consumer protection requirements
- Force majeure provisions (Article 165)

**For Each Issue Provide:**
- Specific Egyptian law article reference
- Clear description of the violation or concern
- Practical suggestion for compliance
- Example fix when applicable

Always reference specific articles from Egyptian law and provide actionable, legally sound recommendations.`;

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

// Analyze contract with structured output
export async function analyzeContract(
  contractText: string
): Promise<ContractAnalysis> {
  try {
    const model = getGeminiModel();
    
    const { object } = await generateObject({
      model,
      schema: contractAnalysisSchema,
      system: EGYPTIAN_LAW_SYSTEM_PROMPT,
      prompt: buildAnalysisPrompt(contractText),
      temperature: 0.3,
    });

    return object;
  } catch (error) {
    console.error("Contract analysis error:", error);
    
    // Return error result
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
      generalInsights: "Analysis failed due to an error. Please try again.",
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
  
  prompt += `**Contract Summary:**\n${contractText.substring(0, 2000)}${contractText.length > 2000 ? '...' : ''}\n\n`;
  
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
      answer: "I apologize, but I encountered an error while processing your question. Please try again.",
      relatedIssues: [],
      lawReferences: [],
      additionalSuggestions: [],
    };
  }
}
