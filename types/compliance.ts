export enum Platform {
  Android = "android",
  iOS = "ios",
  ReactNative = "react-native",
  Flutter = "flutter",
}

export enum Store {
  GooglePlay = "google-play",
  AppStore = "app-store",
}

export enum ViolationSeverity {
  Critical = "critical",
  High = "high",
  Medium = "medium",
  Low = "low",
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  store: Store;
  platforms: Platform[];
  severity: ViolationSeverity;
  category: string;
  checkPattern?: string;
  documentation?: string;
}

export interface CodeLocation {
  filePath: string;
  startLine: number;
  endLine: number;
  snippet: string;
}

export interface ComplianceViolation {
  ruleId: string;
  ruleName: string;
  severity: ViolationSeverity;
  description: string;
  codeLocation: CodeLocation;
  suggestion: string;
  fixCode?: string;
  documentation?: string;
}

export interface ComplianceSummary {
  totalViolations: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  complianceScore: number; // 0-100
  overallStatus: "pass" | "warning" | "fail";
}

export interface ComplianceResult {
  platform: Platform;
  store: Store;
  summary: ComplianceSummary;
  violations: ComplianceViolation[];
  analyzedFiles: string[];
  timestamp: string;
  aiInsights?: string;
}

export interface ProjectStructure {
  platform: Platform;
  files: Record<string, string>; // filepath -> content
  configFiles: {
    manifest?: string;
    buildConfig?: string;
    plist?: string;
    podfile?: string;
    packageJson?: string;
    pubspec?: string;
  };
}

export interface UploadResponse {
  success: boolean;
  projectStructure?: ProjectStructure;
  error?: string;
}

export interface AnalysisProgress {
  stage: "uploading" | "extracting" | "analyzing" | "completed" | "error";
  progress: number; // 0-100
  message: string;
}

