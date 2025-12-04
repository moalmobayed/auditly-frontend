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
          <Upload className="ml-2 h-4 w-4" />
          رفع ملف
        </Button>
        <Button
          variant={uploadMethod === "text" ? "default" : "outline"}
          onClick={() => {
            setUploadMethod("text");
            handleReset();
          }}
          disabled={disabled || uploadState.status === "extracting"}
        >
          <FileText className="ml-2 h-4 w-4" />
          لصق النص
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
                    <p className="text-sm font-medium">جاري استخراج النص...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      معالجة {uploadState.fileName}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium mb-1">
                      انقر للرفع أو اسحب وأفلت
                    </p>
                    <p className="text-xs text-muted-foreground">
                      الصيغ المدعومة: PDF، DOCX، TXT (الحد الأقصى 10MB)
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
            placeholder="الصق نص العقد هنا..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={disabled || uploadState.status === "extracting"}
          />
          <Button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || disabled || uploadState.status === "extracting"}
            className="w-full"
          >
            <FileText className="ml-2 h-4 w-4" />
            استخدم هذا النص
          </Button>
        </div>
      )}

      {/* Status Messages */}
      {uploadState.status === "ready" && (
        <Alert className="border-green-500 bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">جاهز للتحليل</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            {uploadState.fileName
              ? `تمت معالجة الملف "${uploadState.fileName}" بنجاح`
              : "تم تحميل نص العقد بنجاح"}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="mr-2"
            >
              تغيير
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {uploadState.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>
            {uploadState.error}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="mr-2"
            >
              حاول مرة أخرى
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
