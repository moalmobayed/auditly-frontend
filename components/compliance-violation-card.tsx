"use client";

import { useState } from "react";
import { ComplianceViolation } from "@/types/compliance";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  FileCode,
  Lightbulb,
} from "lucide-react";

interface ComplianceViolationCardProps {
  violation: ComplianceViolation;
}

export function ComplianceViolationCard({
  violation,
}: ComplianceViolationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 hover:bg-red-600";
      case "high":
        return "bg-orange-500 hover:bg-orange-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500";
      case "high":
        return "border-orange-500";
      case "medium":
        return "border-yellow-500";
      case "low":
        return "border-blue-500";
      default:
        return "border-gray-500";
    }
  };

  const handleCopyFix = async () => {
    if (violation.fixCode) {
      await navigator.clipboard.writeText(violation.fixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className={`border-l-4 ${getSeverityBorderColor(violation.severity)}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <Badge className={getSeverityColor(violation.severity)}>
                  {violation.severity.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-lg">{violation.ruleName}</CardTitle>
              <CardDescription className="mt-2">
                {violation.description}
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Code Location */}
            {violation.codeLocation && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileCode className="h-4 w-4" />
                  <span>Location</span>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">
                    {violation.codeLocation.filePath}
                    {violation.codeLocation.startLine > 0 && (
                      <span>
                        {" "}
                        (Lines {violation.codeLocation.startLine}-
                        {violation.codeLocation.endLine})
                      </span>
                    )}
                  </div>
                  {violation.codeLocation.snippet && (
                    <pre className="text-xs bg-background p-2 rounded border overflow-x-auto">
                      <code>{violation.codeLocation.snippet}</code>
                    </pre>
                  )}
                </div>
              </div>
            )}

            {/* Suggestion */}
            {violation.suggestion && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>Suggested Fix</span>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md">
                  <p className="text-sm">{violation.suggestion}</p>
                </div>
              </div>
            )}

            {/* Fix Code */}
            {violation.fixCode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Replacement Code</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyFix}
                    className="h-8"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                  <code>{violation.fixCode}</code>
                </pre>
              </div>
            )}

            {/* Documentation Link */}
            {violation.documentation && (
              <div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  asChild
                >
                  <a
                    href={violation.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Official Documentation
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

