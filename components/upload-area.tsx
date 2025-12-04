"use client";

import { useRef, useState } from "react";
import { Upload, FileArchive, FileCode, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  isUploading?: boolean;
  acceptedFormats?: string;
}

export function UploadArea({
  onFileSelect,
  disabled = false,
  isUploading = false,
  acceptedFormats = ".zip,.xml,.plist,.gradle,.yaml,.yml,.json",
}: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);

    if (disabled || isUploading) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed transition-all ${
        disabled || isUploading
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:border-primary"
      } ${isDragging ? "border-primary bg-primary/5" : ""}`}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-10">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center gap-4 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div>
                <p className="text-sm font-medium">Uploading and processing...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please wait while we analyze your files
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-4">
                <FileArchive className="h-12 w-12 text-muted-foreground" />
                <FileCode className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: ZIP archives, XML, PLIST, Gradle, YAML, JSON
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

