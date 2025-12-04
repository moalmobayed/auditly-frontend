"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ComplianceSummaryCard } from "@/components/compliance-summary";
import { ComplianceViolationCard } from "@/components/compliance-violation-card";
import { ComplianceResult, ViolationSeverity } from "@/types/compliance";
import {
  ArrowLeft,
  Download,
  FileText,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

export default function ComplianceResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<ViolationSeverity | "all">(
    "all"
  );

  useEffect(() => {
    // Load result from sessionStorage
    const savedResult = sessionStorage.getItem("complianceResult");
    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);
        setResult(parsed);
      } catch (error) {
        console.error("Failed to parse result:", error);
        router.push("/compliance");
      }
    } else {
      router.push("/compliance");
    }
  }, [router]);

  const handleDownloadReport = () => {
    if (!result) return;

    const reportData = {
      ...result,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredViolations =
    filterSeverity === "all"
      ? result?.violations || []
      : result?.violations.filter((v) => v.severity === filterSeverity) || [];

  // Group violations by severity
  const violationsBySeverity = {
    critical:
      result?.violations.filter((v) => v.severity === ViolationSeverity.Critical) ||
      [],
    high:
      result?.violations.filter((v) => v.severity === ViolationSeverity.High) || [],
    medium:
      result?.violations.filter((v) => v.severity === ViolationSeverity.Medium) ||
      [],
    low:
      result?.violations.filter((v) => v.severity === ViolationSeverity.Low) || [],
  };

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const storeName =
    result.store === "google-play" ? "Google Play" : "iOS App Store";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/compliance")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Checker
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadReport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Analysis Results</h1>
          <p className="text-muted-foreground">
            Platform: {result.platform} • Store: {storeName} • Analyzed on{" "}
            {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Summary */}
        <ComplianceSummaryCard summary={result.summary} />

        {/* AI Insights */}
        {result.aiInsights && (
          <Alert className="border-blue-500 bg-blue-500/10">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-sm">
              <strong className="text-blue-600 dark:text-blue-400">
                AI Insights:
              </strong>{" "}
              {result.aiInsights}
            </AlertDescription>
          </Alert>
        )}

        {/* Filter Tabs */}
        {result.violations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Violations Found</CardTitle>
              <CardDescription>
                Review and fix the following compliance violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={filterSeverity === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterSeverity("all")}
                >
                  All ({result.violations.length})
                </Button>
                {result.summary.critical > 0 && (
                  <Button
                    variant={
                      filterSeverity === ViolationSeverity.Critical
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterSeverity(ViolationSeverity.Critical)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Critical ({result.summary.critical})
                  </Button>
                )}
                {result.summary.high > 0 && (
                  <Button
                    variant={
                      filterSeverity === ViolationSeverity.High
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterSeverity(ViolationSeverity.High)}
                    className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    High ({result.summary.high})
                  </Button>
                )}
                {result.summary.medium > 0 && (
                  <Button
                    variant={
                      filterSeverity === ViolationSeverity.Medium
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterSeverity(ViolationSeverity.Medium)}
                    className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                  >
                    Medium ({result.summary.medium})
                  </Button>
                )}
                {result.summary.low > 0 && (
                  <Button
                    variant={
                      filterSeverity === ViolationSeverity.Low
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setFilterSeverity(ViolationSeverity.Low)}
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    Low ({result.summary.low})
                  </Button>
                )}
              </div>

              {/* Violations List */}
              <div className="space-y-4">
                {filteredViolations.length > 0 ? (
                  filteredViolations.map((violation, index) => (
                    <ComplianceViolationCard
                      key={`${violation.ruleId}-${index}`}
                      violation={violation}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No violations found for the selected filter.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Violations */}
        {result.violations.length === 0 && (
          <Alert className="border-green-500 bg-green-500/10">
            <AlertCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-600 dark:text-green-400">
              <strong>Congratulations!</strong> No compliance violations were
              found. Your application appears to meet the {storeName} guidelines.
            </AlertDescription>
          </Alert>
        )}

        {/* Analyzed Files */}
        {result.analyzedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyzed Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {result.analyzedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded"
                  >
                    {file}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

