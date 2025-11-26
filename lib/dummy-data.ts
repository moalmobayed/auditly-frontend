import { ScanResult } from "@/types/auditly";

export const dummyScanResult: ScanResult = {
  overallRiskLevel: "medium",
  overallRiskScore: 65,
  summary: {
    totalDependencies: 42,
    highRisk: 2,
    mediumRisk: 5,
    lowRisk: 35,
    mainWarning: "Critical license violation detected in 'evil-lib' v1.0.0",
  },
  dependencies: [
    {
      name: "evil-lib",
      version: "1.0.0",
      license: "GPL-3.0",
      riskLevel: "high",
      issues: [
        {
          type: "license",
          title: "Viral License Detected",
          description:
            "GPL-3.0 is a copyleft license which requires your entire project to be open source.",
          legalImpact:
            "High risk of IP contamination. Cannot be used in proprietary software.",
          businessImpact:
            "Potential lawsuit or forced open-sourcing of proprietary code.",
        },
      ],
      impact: {
        legal: "Critical",
        business: "High",
        technical: "Low",
        severityScore: 90,
      },
      recommendation: {
        action: "Replace immediately",
        steps: ["Uninstall evil-lib", "Find MIT alternative like 'good-lib'"],
      },
    },
    {
      name: "sketchy-utils",
      version: "2.4.1",
      license: "Unknown",
      riskLevel: "medium",
      issues: [
        {
          type: "maintenance",
          title: "Deprecated Package",
          description: "This package has not been updated in 4 years.",
          legalImpact: "Low",
          businessImpact: "Security vulnerabilities may not be patched.",
        },
      ],
      impact: {
        legal: "Low",
        business: "Medium",
        technical: "Medium",
        severityScore: 55,
      },
      recommendation: {
        action: "Review usage",
        steps: ["Check if functionality is needed", "Consider forking"],
      },
    },
    {
      name: "react",
      version: "18.2.0",
      license: "MIT",
      riskLevel: "low",
      issues: [],
      impact: {
        legal: "None",
        business: "None",
        technical: "None",
        severityScore: 0,
      },
      recommendation: {
        action: "Keep",
        steps: [],
      },
    },
    {
      name: "lodash",
      version: "4.17.21",
      license: "MIT",
      riskLevel: "low",
      issues: [],
      impact: {
        legal: "None",
        business: "None",
        technical: "None",
        severityScore: 0,
      },
      recommendation: {
        action: "Keep",
        steps: [],
      },
    },
    {
      name: "axios",
      version: "1.6.0",
      license: "MIT",
      riskLevel: "low",
      issues: [],
      impact: {
        legal: "None",
        business: "None",
        technical: "None",
        severityScore: 0,
      },
      recommendation: {
        action: "Keep",
        steps: [],
      },
    },
  ],
  aiSummary: {
    narrative:
      "The scan detected 2 significant risks. The primary concern is the use of 'evil-lib' which carries a GPL-3.0 license, incompatible with your proprietary distribution model. Additionally, 'sketchy-utils' is unmaintained.",
    recommendedNextSteps: [
      "Immediately remove 'evil-lib' to avoid legal exposure.",
      "Audit usage of 'sketchy-utils' and plan a migration.",
      "Run a fresh scan after changes.",
    ],
  },
  analysisLimitations:
    "This scan is based on public package metadata and may not detect obfuscated code or dynamic imports.",
};
