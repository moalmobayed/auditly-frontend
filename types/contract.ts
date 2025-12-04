import { z } from "zod";

// Severity levels for contract issues
export enum Severity {
  Critical = "critical",
  High = "high",
  Medium = "medium",
  Low = "low",
}

// Zod schema for individual contract issue
export const contractIssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: z.nativeEnum(Severity),
  description: z.string(),
  egyptianLawReference: z.object({
    article: z.string(),
    lawName: z.string(),
    articleText: z.string().optional(),
  }),
  suggestion: z.string(),
  affectedClause: z.string().optional(),
  fixExample: z.string().optional(),
});

// Zod schema for complete contract analysis
export const contractAnalysisSchema = z.object({
  summary: z.object({
    totalIssues: z.number(),
    criticalCount: z.number(),
    highCount: z.number(),
    mediumCount: z.number(),
    lowCount: z.number(),
    overallRisk: z.enum(["critical", "high", "moderate", "low"]),
  }),
  issues: z.object({
    critical: z.array(contractIssueSchema),
    high: z.array(contractIssueSchema),
    medium: z.array(contractIssueSchema),
    low: z.array(contractIssueSchema),
  }),
  generalInsights: z.string(),
  recommendations: z.array(z.string()),
});

// Zod schema for chat response with structured output
export const chatResponseSchema = z.object({
  answer: z.string(),
  relatedIssues: z.array(z.string()).optional(),
  lawReferences: z.array(z.object({
    article: z.string(),
    lawName: z.string(),
    relevance: z.string(),
  })).optional(),
  additionalSuggestions: z.array(z.string()).optional(),
});

// TypeScript types derived from Zod schemas
export type ContractIssue = z.infer<typeof contractIssueSchema>;
export type ContractAnalysis = z.infer<typeof contractAnalysisSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;

// Chat message structure
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  structured?: ChatResponse;
}

// Upload state
export interface ContractUploadState {
  status: "idle" | "uploading" | "extracting" | "ready" | "error";
  fileName?: string;
  fileSize?: number;
  text?: string;
  error?: string;
}

// Analysis state
export interface AnalysisState {
  status: "idle" | "analyzing" | "complete" | "error";
  result?: ContractAnalysis;
  error?: string;
}
