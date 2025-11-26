export type RiskLevel = "low" | "medium" | "high";

export interface Issue {
  type: string;
  title: string;
  description: string;
  legalImpact: string;
  businessImpact: string;
}

export interface Impact {
  legal: string;
  business: string;
  technical: string;
  severityScore: number;
}

export interface Recommendation {
  action: string;
  steps: string[];
}

export interface Dependency {
  name: string;
  version: string;
  license: string;
  riskLevel: RiskLevel;
  issues: Issue[];
  impact: Impact;
  recommendation: Recommendation;
}

export interface Summary {
  totalDependencies: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  mainWarning: string;
}

export interface AISummary {
  narrative: string;
  recommendedNextSteps: string[];
}

export interface ScanResult {
  overallRiskLevel: RiskLevel;
  overallRiskScore: number;
  summary: Summary;
  dependencies: Dependency[];
  aiSummary: AISummary;
  analysisLimitations: string;
}
