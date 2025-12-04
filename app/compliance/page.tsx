"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { PlatformSelector } from "@/components/platform-selector";
import { UploadArea } from "@/components/upload-area";
import { SourceLinkInput } from "@/components/source-link-input";
import { Platform, Store, ProjectStructure } from "@/types/compliance";
import { ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { processUploadedFile } from "@/lib/file-handler";
import { fetchRepositoryContents } from "@/lib/source-fetcher";

export default function CompliancePage() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  );
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "repo">("file");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectStructure, setProjectStructure] =
    useState<ProjectStructure | null>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setIsUploading(true);

    try {
      const structure = await processUploadedFile(file);

      if (structure) {
        setProjectStructure(structure);
        // Auto-detect platform if not selected
        if (!selectedPlatform) {
          setSelectedPlatform(structure.platform);

          // Auto-select store based on platform
          if (structure.platform === Platform.Android) {
            setSelectedStore(Store.GooglePlay);
          } else if (structure.platform === Platform.iOS) {
            setSelectedStore(Store.AppStore);
          }
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process file"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRepoSubmit = async (url: string, branch?: string) => {
    setError(null);
    setIsUploading(true);

    try {
      const result = await fetchRepositoryContents({ url, branch });

      if (result.success && result.projectStructure) {
        setProjectStructure(result.projectStructure);

        // Auto-detect platform
        if (!selectedPlatform) {
          setSelectedPlatform(result.projectStructure.platform);

          // Auto-select store based on platform
          if (result.projectStructure.platform === Platform.Android) {
            setSelectedStore(Store.GooglePlay);
          } else if (result.projectStructure.platform === Platform.iOS) {
            setSelectedStore(Store.AppStore);
          }
        }
      } else {
        setError(result.error || "Failed to fetch repository");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch repository"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!projectStructure || !selectedStore) {
      setError("Please upload files and select a target store");
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/compliance/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectStructure,
          store: selectedStore,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed");
      }

      const result = await response.json();

      // Store result in sessionStorage
      sessionStorage.setItem("complianceResult", JSON.stringify(result));
      router.push("/compliance/results");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze compliance"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">App Store Compliance Checker</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your mobile application or provide a repository link to check
            compliance with Google Play Store and Apple App Store guidelines.
            Our AI-powered tool will identify violations and provide actionable
            suggestions.
          </p>
        </div>

        {/* Platform Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Platform & Store</CardTitle>
            <CardDescription>
              Choose your app platform and target app store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformSelector
              selectedPlatform={selectedPlatform}
              selectedStore={selectedStore}
              onPlatformChange={setSelectedPlatform}
              onStoreChange={setSelectedStore}
              disabled={isUploading || isAnalyzing}
            />
          </CardContent>
        </Card>

        {/* Upload Method Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Upload Your Application</CardTitle>
            <CardDescription>
              Choose how you want to provide your application code
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Method Tabs */}
            <div className="flex gap-2">
              <Button
                variant={uploadMethod === "file" ? "default" : "outline"}
                onClick={() => setUploadMethod("file")}
                disabled={isUploading || isAnalyzing}
              >
                Upload Files
              </Button>
              <Button
                variant={uploadMethod === "repo" ? "default" : "outline"}
                onClick={() => setUploadMethod("repo")}
                disabled={isUploading || isAnalyzing}
              >
                Repository Link
              </Button>
            </div>

            <Separator />

            {/* Upload Area or Repo Input */}
            {uploadMethod === "file" ? (
              <UploadArea
                onFileSelect={handleFileSelect}
                disabled={isAnalyzing}
                isUploading={isUploading}
              />
            ) : (
              <SourceLinkInput
                onSubmit={handleRepoSubmit}
                disabled={isAnalyzing}
                isLoading={isUploading}
              />
            )}

            {/* Success Message */}
            {projectStructure && !isUploading && (
              <Alert className="border-green-500 bg-green-500/10">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-500">
                  Files Processed Successfully
                </AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-400">
                  Detected platform: {projectStructure.platform}. Ready to
                  analyze for compliance.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Run Compliance Analysis</CardTitle>
            <CardDescription>
              Our AI will analyze your code against store guidelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="w-full"
              onClick={handleAnalyze}
              disabled={
                !projectStructure || !selectedStore || isUploading || isAnalyzing
              }
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Compliance...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Analyze Compliance
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Privacy Notice</AlertTitle>
          <AlertDescription>
            Your code is analyzed securely and is not stored permanently. We use
            Google AI Studio for intelligent compliance checking.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}

