"use client";

import { ComplianceSummary } from "@/types/compliance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
} from "lucide-react";

interface ComplianceSummaryProps {
  summary: ComplianceSummary;
}

export function ComplianceSummaryCard({ summary }: ComplianceSummaryProps) {
  const getStatusIcon = () => {
    switch (summary.overallStatus) {
      case "pass":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "fail":
        return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (summary.overallStatus) {
      case "pass":
        return "Passed";
      case "warning":
        return "Warning";
      case "fail":
        return "Failed";
    }
  };

  const getStatusColor = () => {
    switch (summary.overallStatus) {
      case "pass":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "fail":
        return "text-red-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Compliance Summary</span>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`text-lg ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compliance Score */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp
              className={`h-5 w-5 ${getScoreColor(summary.complianceScore)}`}
            />
            <span className="text-sm font-medium text-muted-foreground">
              Compliance Score
            </span>
          </div>
          <div
            className={`text-5xl font-bold ${getScoreColor(
              summary.complianceScore
            )}`}
          >
            {summary.complianceScore}
          </div>
          <p className="text-sm text-muted-foreground mt-1">out of 100</p>
        </div>

        {/* Violations Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Violations by Severity</h4>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-red-500/10 border-red-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-500">
                  {summary.critical}
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-red-500/50 text-red-500"
                >
                  Critical
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-500">
                  {summary.high}
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-orange-500/50 text-orange-500"
                >
                  High
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-yellow-500/10 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-500">
                  {summary.medium}
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-500/50 text-yellow-500"
                >
                  Medium
                </Badge>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-500">
                  {summary.low}
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-blue-500/50 text-blue-500"
                >
                  Low
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Total */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Violations</span>
            <span className="text-2xl font-bold">{summary.totalViolations}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

