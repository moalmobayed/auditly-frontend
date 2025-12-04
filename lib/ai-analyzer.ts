import { generateText } from "ai";
import { getGeminiModel } from "./ai-client";
import {
  ComplianceRule,
  ComplianceViolation,
  ComplianceResult,
  ComplianceSummary,
  Platform,
  Store,
  ProjectStructure,
  ViolationSeverity,
} from "@/types/compliance";
import { getRulesByStoreAndPlatform } from "./compliance-rules";

// Build AI prompt for code analysis
function buildAnalysisPrompt(
  projectStructure: ProjectStructure,
  store: Store,
  rules: ComplianceRule[]
): string {
  const platform = projectStructure.platform;
  const storeName = store === Store.GooglePlay ? "Google Play" : "iOS App Store";

  let prompt = `You are an expert mobile app compliance analyzer. Analyze the following ${platform} application code for ${storeName} compliance violations.

**Your Task:**
Carefully review the provided code files against the compliance rules listed below. For each violation found, provide detailed information in a structured JSON format.

**Compliance Rules to Check:**
`;

  // Add rules to the prompt
  rules.forEach((rule, index) => {
    prompt += `\n${index + 1}. **${rule.name}** (ID: ${rule.id}, Severity: ${rule.severity})
   - Description: ${rule.description}
   - Category: ${rule.category}`;
    if (rule.checkPattern) {
      prompt += `\n   - Check Pattern: ${rule.checkPattern}`;
    }
  });

  prompt += `\n\n**Code Files to Analyze:**\n`;

  // Add config files
  if (projectStructure.configFiles.manifest) {
    prompt += `\n--- AndroidManifest.xml ---\n${projectStructure.configFiles.manifest}\n`;
  }
  if (projectStructure.configFiles.buildConfig) {
    prompt += `\n--- build.gradle ---\n${projectStructure.configFiles.buildConfig}\n`;
  }
  if (projectStructure.configFiles.plist) {
    prompt += `\n--- Info.plist ---\n${projectStructure.configFiles.plist}\n`;
  }
  if (projectStructure.configFiles.podfile) {
    prompt += `\n--- Podfile ---\n${projectStructure.configFiles.podfile}\n`;
  }
  if (projectStructure.configFiles.packageJson) {
    prompt += `\n--- package.json ---\n${projectStructure.configFiles.packageJson}\n`;
  }
  if (projectStructure.configFiles.pubspec) {
    prompt += `\n--- pubspec.yaml ---\n${projectStructure.configFiles.pubspec}\n`;
  }

  prompt += `\n\n**Output Format:**
Return your analysis as a JSON object with the following structure:
{
  "violations": [
    {
      "ruleId": "rule-id-here",
      "ruleName": "Rule Name",
      "severity": "critical|high|medium|low",
      "description": "Detailed description of the violation",
      "codeLocation": {
        "filePath": "path/to/file",
        "startLine": 10,
        "endLine": 15,
        "snippet": "code snippet showing the issue"
      },
      "suggestion": "Specific actionable suggestion to fix the violation",
      "fixCode": "Optional: suggested code to replace the violating code"
    }
  ],
  "aiInsights": "Overall assessment and recommendations for compliance"
}

**Important Guidelines:**
1. Only report actual violations found in the code
2. Be specific about line numbers and file paths
3. Provide actionable, practical suggestions
4. Include code snippets that clearly show the problem
5. If a required element is missing (like privacy policy URL), report it as a violation
6. Consider the platform and store context when analyzing
7. Return valid JSON only, no additional text

Begin your analysis now:`;

  return prompt;
}

// Parse AI response and extract violations
function parseAIResponse(
  aiResponse: string,
  rules: ComplianceRule[]
): {
  violations: ComplianceViolation[];
  aiInsights: string;
} {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in AI response");
      return { violations: [], aiInsights: aiResponse };
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate and map violations
    const violations: ComplianceViolation[] = (parsed.violations || []).map(
      (v: any) => {
        // Find the matching rule to ensure severity is correct
        const rule = rules.find((r) => r.id === v.ruleId);

        return {
          ruleId: v.ruleId || "unknown",
          ruleName: v.ruleName || "Unknown Rule",
          severity: rule?.severity || v.severity || ViolationSeverity.Medium,
          description: v.description || "",
          codeLocation: {
            filePath: v.codeLocation?.filePath || "unknown",
            startLine: v.codeLocation?.startLine || 0,
            endLine: v.codeLocation?.endLine || 0,
            snippet: v.codeLocation?.snippet || "",
          },
          suggestion: v.suggestion || "",
          fixCode: v.fixCode,
          documentation: rule?.documentation,
        };
      }
    );

    return {
      violations,
      aiInsights: parsed.aiInsights || "Analysis completed successfully.",
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      violations: [],
      aiInsights: "Error parsing AI response. Please try again.",
    };
  }
}

// Calculate compliance summary
function calculateSummary(
  violations: ComplianceViolation[]
): ComplianceSummary {
  const summary: ComplianceSummary = {
    totalViolations: violations.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    complianceScore: 100,
    overallStatus: "pass",
  };

  violations.forEach((v) => {
    switch (v.severity) {
      case ViolationSeverity.Critical:
        summary.critical++;
        break;
      case ViolationSeverity.High:
        summary.high++;
        break;
      case ViolationSeverity.Medium:
        summary.medium++;
        break;
      case ViolationSeverity.Low:
        summary.low++;
        break;
    }
  });

  // Calculate score (weighted by severity)
  const score =
    100 -
    (summary.critical * 25 +
      summary.high * 15 +
      summary.medium * 8 +
      summary.low * 3);
  summary.complianceScore = Math.max(0, score);

  // Determine overall status
  if (summary.critical > 0) {
    summary.overallStatus = "fail";
  } else if (summary.high > 0 || summary.medium > 2) {
    summary.overallStatus = "warning";
  } else {
    summary.overallStatus = "pass";
  }

  return summary;
}

// Main analysis function
export async function analyzeCompliance(
  projectStructure: ProjectStructure,
  store: Store
): Promise<ComplianceResult> {
  const platform = projectStructure.platform;
  const rules = getRulesByStoreAndPlatform(store, platform);

  // Build prompt
  const prompt = buildAnalysisPrompt(projectStructure, store, rules);

  try {
    // Call AI model
    const model = getGeminiModel();
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3, // Lower temperature for more consistent analysis
      maxTokens: 4000,
    });

    // Parse response
    const { violations, aiInsights } = parseAIResponse(text, rules);

    // Calculate summary
    const summary = calculateSummary(violations);

    // Get list of analyzed files
    const analyzedFiles = Object.keys(projectStructure.configFiles).filter(
      (key) => projectStructure.configFiles[key as keyof typeof projectStructure.configFiles]
    );

    return {
      platform,
      store,
      summary,
      violations,
      analyzedFiles,
      timestamp: new Date().toISOString(),
      aiInsights,
    };
  } catch (error) {
    console.error("Error during AI analysis:", error);

    // Return error result
    return {
      platform,
      store,
      summary: {
        totalViolations: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        complianceScore: 0,
        overallStatus: "fail",
      },
      violations: [],
      analyzedFiles: [],
      timestamp: new Date().toISOString(),
      aiInsights: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// Analyze for multiple stores
export async function analyzeMultipleStores(
  projectStructure: ProjectStructure,
  stores: Store[]
): Promise<Record<Store, ComplianceResult>> {
  const results: Record<Store, ComplianceResult> = {} as any;

  for (const store of stores) {
    results[store] = await analyzeCompliance(projectStructure, store);
  }

  return results;
}

