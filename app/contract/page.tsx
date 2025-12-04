"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ContractUpload } from "@/components/contract-upload";
import { ContractAnalysisDisplay } from "@/components/contract-analysis-display";
import { ContractChat } from "@/components/contract-chat";
import { Scale, Loader2, AlertCircle, FileCheck } from "lucide-react";
import { ContractAnalysis } from "@/types/contract";

interface ErrorState {
  message: string;
  type?: string;
  retryable?: boolean;
}

export default function ContractPage() {
  const [contractText, setContractText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

  const handleTextExtracted = (text: string) => {
    setContractText(text);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!contractText) {
      setError({ message: "Please upload a contract first", retryable: false });
      return;
    }

    console.log("=== STARTING CONTRACT ANALYSIS ===");
    console.log("Contract Text Length:", contractText.length);
    console.log("Contract Text Preview:", contractText.substring(0, 500));
    console.log("==================================");

    setError(null);
    setIsAnalyzing(true);

    try {
      const requestBody = { contractText };
      console.log("=== API REQUEST ===");
      console.log("Endpoint: /api/contract/analyze");
      console.log("Request Body:", requestBody);
      console.log("==================");

      const response = await fetch("/api/contract/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("=== API RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("====================");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        console.error("=== API ERROR ===");
        console.error("Status:", response.status);
        console.error("Error Data:", errorData);
        console.error("=================");

        // Handle quota errors specifically
        if (
          response.status === 429 ||
          errorData.errorType === "quota_exceeded"
        ) {
          setError({
            message:
              errorData.error ||
              "API quota limit exceeded. Please wait a moment and try again.",
            type: "quota_exceeded",
            retryable: true,
          });
        } else {
          setError({
            message: errorData.error || "Analysis failed",
            type: errorData.errorType || "error",
            retryable: errorData.retryable || false,
          });
        }
        return;
      }

      const result = await response.json();

      console.log("=== ANALYSIS RESULT ===");
      console.log("Success:", result.success);
      console.log("Analysis Object:", result.analysis);
      console.log("\n--- SUMMARY ---");
      console.log("Total Issues:", result.analysis?.summary?.totalIssues);
      console.log("Critical Count:", result.analysis?.summary?.criticalCount);
      console.log("High Count:", result.analysis?.summary?.highCount);
      console.log("Medium Count:", result.analysis?.summary?.mediumCount);
      console.log("Low Count:", result.analysis?.summary?.lowCount);
      console.log("Overall Risk:", result.analysis?.summary?.overallRisk);
      console.log("\n--- ISSUES ---");
      console.log("Critical Issues:", result.analysis?.issues?.critical);
      console.log("High Issues:", result.analysis?.issues?.high);
      console.log("Medium Issues:", result.analysis?.issues?.medium);
      console.log("Low Issues:", result.analysis?.issues?.low);
      console.log("\n--- INSIGHTS ---");
      console.log("General Insights:", result.analysis?.generalInsights);
      console.log("\n--- RECOMMENDATIONS ---");
      console.log("Recommendations:", result.analysis?.recommendations);
      console.log("======================");

      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
        console.log("✅ Analysis successfully set in state");
      } else {
        console.error("❌ Invalid response format:", result);
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("=== ANALYSIS EXCEPTION ===");
      console.error("Error:", err);
      console.error("Error Type:", err instanceof Error ? err.constructor.name : typeof err);
      console.error("Error Message:", err instanceof Error ? err.message : String(err));
      console.error("Error Stack:", err instanceof Error ? err.stack : "N/A");
      console.error("=========================");
      
      setError({
        message:
          err instanceof Error ? err.message : "Failed to analyze contract",
        retryable: false,
      });
    } finally {
      setIsAnalyzing(false);
      console.log("=== ANALYSIS COMPLETE ===");
      console.log("Is Analyzing:", false);
      console.log("========================");
    }
  };

  const handleReset = () => {
    setContractText(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Scale className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">
              Egyptian Law Contract Analyzer
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Upload your contract and get comprehensive legal analysis based on
            Egyptian Civil Code, Commercial Code, and Labor Law. Our AI-powered
            system identifies issues, violations, and provides actionable
            recommendations.
          </p>
        </div>

        {/* Step 1: Upload Contract */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload Your Contract</CardTitle>
            <CardDescription>
              Upload a PDF, DOCX, or TXT file, or paste your contract text
              directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContractUpload
              onTextExtracted={handleTextExtracted}
              disabled={isAnalyzing}
            />
          </CardContent>
        </Card>

        {/* Step 2: Analyze */}
        {contractText && !analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Analyze Contract</CardTitle>
              <CardDescription>
                Start AI-powered analysis against Egyptian law requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="lg"
                className="w-full"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Contract...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-5 w-5" />
                    Analyze Contract
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Alert
            variant={
              error.type === "quota_exceeded" ? "default" : "destructive"
            }
            className={
              error.type === "quota_exceeded"
                ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30"
                : ""
            }
          >
            <AlertCircle
              className={
                error.type === "quota_exceeded"
                  ? "h-4 w-4 text-yellow-600"
                  : "h-4 w-4"
              }
            />
            <AlertTitle
              className={
                error.type === "quota_exceeded"
                  ? "text-yellow-800 dark:text-yellow-200"
                  : ""
              }
            >
              {error.type === "quota_exceeded" ? "Rate Limit Reached" : "Error"}
            </AlertTitle>
            <AlertDescription
              className={
                error.type === "quota_exceeded"
                  ? "text-yellow-700 dark:text-yellow-300"
                  : ""
              }
            >
              <div className="space-y-2">
                <p>{error.message}</p>
                {error.type === "quota_exceeded" && (
                  <div className="text-sm mt-2 space-y-1">
                    <p className="font-medium">What you can do:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Wait 1-2 minutes and try again</li>
                      <li>
                        Check your Google AI API quota at{" "}
                        <a
                          href="https://ai.dev/usage"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          ai.dev/usage
                        </a>
                      </li>
                      <li>
                        Consider upgrading your API plan for higher limits
                      </li>
                    </ul>
                  </div>
                )}
                {error.retryable && (
                  <Button
                    variant={
                      error.type === "quota_exceeded" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="mt-3"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Retrying...
                      </>
                    ) : (
                      "Try Again"
                    )}
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Analysis Results */}
        {analysis && contractText && (
          <>
            <Separator className="my-8" />

            {/* Analysis Display */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Analysis Results</h2>
                <Button variant="outline" onClick={handleReset}>
                  Analyze Another Contract
                </Button>
              </div>
              <ContractAnalysisDisplay analysis={analysis} />
            </div>

            <Separator className="my-8" />

            {/* Chat Interface */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Ask Questions</h2>
              <ContractChat contractText={contractText} analysis={analysis} />
            </div>
          </>
        )}

        {/* Info Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Legal Disclaimer</AlertTitle>
          <AlertDescription>
            This tool provides automated analysis based on Egyptian law
            principles. While our AI is trained on legal frameworks, this
            analysis should not replace professional legal advice. Always
            consult with a qualified legal professional for important contracts.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
