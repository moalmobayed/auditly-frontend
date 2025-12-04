"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Loader2, CheckCircle, XCircle } from "lucide-react";
import { validateRepoUrl } from "@/lib/source-fetcher";

interface SourceLinkInputProps {
  onSubmit: (url: string, branch?: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SourceLinkInput({
  onSubmit,
  disabled = false,
  isLoading = false,
}: SourceLinkInputProps) {
  const [url, setUrl] = useState("");
  const [branch, setBranch] = useState("main");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value) {
      setIsValid(validateRepoUrl(value));
    } else {
      setIsValid(null);
    }
  };

  const handleSubmit = () => {
    if (isValid && url) {
      onSubmit(url, branch);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && isValid && url) {
      handleSubmit();
    }
  };

  return (
    <Card className="border-2">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <GitBranch className="h-4 w-4" />
          <span>Repository URL</span>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Input
              type="url"
              placeholder="https://github.com/username/repo"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled || isLoading}
              className={`pr-10 ${
                isValid === true
                  ? "border-green-500 focus-visible:ring-green-500"
                  : isValid === false
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }`}
            />
            {isValid !== null && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isValid ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Branch (default: main)"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={disabled || isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSubmit}
              disabled={!isValid || disabled || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch & Analyze"
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Supports GitHub, GitLab, Bitbucket, and other Git repositories
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

