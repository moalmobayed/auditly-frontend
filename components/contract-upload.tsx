"use client";

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { validateContractText } from "@/lib/contract-validation";
import { ContractUploadState } from "@/types/contract";

interface ContractUploadProps {
  onTextExtracted: (text: string) => void;
  disabled?: boolean;
}

export function ContractUpload({ onTextExtracted, disabled = false }: ContractUploadProps) {
  const [uploadState, setUploadState] = useState<ContractUploadState>({
    status: "idle",
  });
  const [uploadMethod, setUploadMethod] = useState<"file" | "text">("file");
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    setUploadState({
      status: "extracting",
      fileName: file.name,
      fileSize: file.size,
    });

    try {
      // Create form data to send file to API
      const formData = new FormData();
      formData.append("file", file);

      // Call API to extract text
      const response = await fetch("/api/contract/extract", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      console.log("=== PDF EXTRACTION RESULT ===");
      console.log("Success:", result.success);
      console.log("File Name:", result.fileName);
      console.log("File Size:", result.fileSize);
      console.log("Extracted Text Length:", result.text?.length);
      console.log("Extracted Text Preview:", result.text?.substring(0, 500));
      console.log("Full Extracted Text:", result.text);
      console.log("============================");

      if (result.success && result.text) {
        // Validate extracted text
        const validation = validateContractText(result.text);
        
        console.log("=== TEXT VALIDATION ===");
        console.log("Valid:", validation.valid);
        console.log("Error:", validation.error);
        console.log("======================");
        
        if (!validation.valid) {
          setUploadState({
            status: "error",
            fileName: result.fileName,
            fileSize: result.fileSize,
            error: validation.error,
          });
          return;
        }

        setUploadState({
          status: "ready",
          fileName: result.fileName,
          fileSize: result.fileSize,
          text: result.text,
        });
        
        console.log("=== TEXT EXTRACTED - READY FOR ANALYSIS ===");
        onTextExtracted(result.text);
      } else {
        setUploadState({
          status: "error",
          fileName: result.fileName || file.name,
          fileSize: result.fileSize || file.size,
          error: result.error || "Failed to extract text from file",
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      setUploadState({
        status: "error",
        fileName: file.name,
        fileSize: file.size,
        error: error instanceof Error ? error.message : "Failed to process file",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled && uploadState.status !== "extracting") {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || uploadState.status === "extracting") return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleTextSubmit = () => {
    const trimmedText = textInput.trim();
    
    console.log("=== TEXT INPUT SUBMITTED ===");
    console.log("Text Length:", trimmedText.length);
    console.log("Text Preview:", trimmedText.substring(0, 500));
    console.log("Full Text:", trimmedText);
    console.log("===========================");
    
    const validation = validateContractText(trimmedText);
    
    console.log("=== TEXT VALIDATION ===");
    console.log("Valid:", validation.valid);
    console.log("Error:", validation.error);
    console.log("======================");
    
    if (!validation.valid) {
      setUploadState({
        status: "error",
        error: validation.error,
      });
      return;
    }

    setUploadState({
      status: "ready",
      text: trimmedText,
    });
    
    console.log("=== TEXT READY FOR ANALYSIS ===");
    onTextExtracted(trimmedText);
  };

  const handleReset = () => {
    setUploadState({ status: "idle" });
    setTextInput("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Method Selection */}
      <div className="flex gap-2">
        <Button
          variant={uploadMethod === "file" ? "default" : "outline"}
          onClick={() => {
            setUploadMethod("file");
            handleReset();
          }}
          disabled={disabled || uploadState.status === "extracting"}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        <Button
          variant={uploadMethod === "text" ? "default" : "outline"}
          onClick={() => {
            setUploadMethod("text");
            handleReset();
          }}
          disabled={disabled || uploadState.status === "extracting"}
        >
          <FileText className="mr-2 h-4 w-4" />
          Paste Text
        </Button>
      </div>

      {/* Upload Area */}
      {uploadMethod === "file" ? (
        <Card
          className={`border-2 border-dashed transition-all ${
            disabled || uploadState.status === "extracting"
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary"
          } ${isDragging ? "border-primary bg-primary/5" : ""}`}
          onClick={() => {
            if (!disabled && uploadState.status !== "extracting") {
              fileInputRef.current?.click();
            }
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-10">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled || uploadState.status === "extracting"}
            />

            <div className="flex flex-col items-center gap-4 text-center">
              {uploadState.status === "extracting" ? (
                <>
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <div>
                    <p className="text-sm font-medium">Extracting text...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Processing {uploadState.fileName}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: PDF, DOCX, TXT (Max 10MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <textarea
            className="w-full min-h-[200px] p-4 border rounded-md resize-y"
            placeholder="Paste your contract text here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={disabled || uploadState.status === "extracting"}
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || disabled || uploadState.status === "extracting"}
            className="w-full"
          >
            <FileText className="mr-2 h-4 w-4" />
            Use This Text
          </Button>
        </div>
      )}

      {/* Status Messages */}
      {uploadState.status === "ready" && (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Ready for Analysis</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            {uploadState.fileName
              ? `File "${uploadState.fileName}" processed successfully`
              : "Contract text loaded successfully"}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="ml-2"
            >
              Change
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {uploadState.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {uploadState.error}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
