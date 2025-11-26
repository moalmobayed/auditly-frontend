"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCode, Loader2, AlertCircle } from "lucide-react";
import { uploadPackageJson } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ScanPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await uploadPackageJson(file);
      // Store result in sessionStorage to pass to results page
      sessionStorage.setItem("scanResult", JSON.stringify(result));
      router.push("/scan/results");
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload file. Please try again."
      );
      setIsUploading(false);
    }
  };

  const handleCardClick = () => {
    if (!isUploading) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-dashed border-2">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
            <FileCode className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Scan Project</CardTitle>
          <CardDescription>
            Upload your package.json to analyze dependency risks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/json"
            className="hidden"
          />

          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-muted/50"
            }`}
            onClick={handleCardClick}
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">
                Click to upload package.json
              </span>
              <span className="text-xs">or drag and drop</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleCardClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : error ? (
              "Try Again"
            ) : (
              "Select File"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
