"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ContractUpload } from "@/components/contract-upload";
import { ContractAnalysisDisplay } from "@/components/contract-analysis-display";
import { ContractChat } from "@/components/contract-chat";
import { Scale, Loader2, AlertCircle, FileCheck } from "lucide-react";
import { ContractAnalysis } from "@/types/contract";

export default function ContractPage() {
  const [contractText, setContractText] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ContractAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTextExtracted = (text: string) => {
    setContractText(text);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!contractText) {
      setError("Please upload a contract first");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/contract/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contractText }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      const result = await response.json();

      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze contract");
    } finally {
      setIsAnalyzing(false);
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
            <h1 className="text-4xl font-bold">Egyptian Law Contract Analyzer</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Upload your contract and get comprehensive legal analysis based on Egyptian Civil Code,
            Commercial Code, and Labor Law. Our AI-powered system identifies issues, violations,
            and provides actionable recommendations.
          </p>
        </div>

        {/* Step 1: Upload Contract */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Upload Your Contract</CardTitle>
            <CardDescription>
              Upload a PDF, DOCX, or TXT file, or paste your contract text directly
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
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
            This tool provides automated analysis based on Egyptian law principles. While our AI
            is trained on legal frameworks, this analysis should not replace professional legal
            advice. Always consult with a qualified legal professional for important contracts.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
