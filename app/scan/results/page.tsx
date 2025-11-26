"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Package,
  Loader2,
} from "lucide-react";
import { RiskBadge } from "@/components/risk-badge";
import { DependencyTable } from "@/components/dependency-table";
import { AISummaryCard } from "@/components/ai-summary-card";
import { getRiskColor, getRiskScoreColor } from "@/lib/map-risk-level";
import { Separator } from "@/components/ui/separator";
import { ScanResult } from "@/types/auditly";
import { Button } from "@/components/ui/button";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ScanResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem("scanResult");
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        // Use setTimeout to avoid synchronous state updates during effect execution
        setTimeout(() => setData(parsed), 0);
      } catch (e) {
        console.error("Failed to parse scan result", e);
        router.push("/scan");
      }
    } else {
      router.push("/scan");
    }
  }, [router]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Results</h1>
          <p className="text-muted-foreground">
            Analysis completed for{" "}
            <span className="font-mono text-foreground">package.json</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/scan")}>
            Scan Another
          </Button>
        </div>
      </div>

      {/* Main Warning Alert */}
      {(data.overallRiskLevel === "high" ||
        data.overallRiskLevel === "medium") && (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Warning</AlertTitle>
          <AlertDescription>{data.summary.mainWarning}</AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk</CardTitle>
            {data.overallRiskLevel === "low" ? (
              <ShieldCheck className="h-4 w-4 text-green-500" />
            ) : (
              <ShieldAlert
                className={`h-4 w-4 text-${getRiskColor(
                  data.overallRiskLevel
                )}-500`}
              />
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold capitalize">
                {data.overallRiskLevel}
              </div>
              <RiskBadge level={data.overallRiskLevel} />
            </div>
            <p className="text-xs text-muted-foreground">
              Based on dependency analysis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <div
              className={`text-sm font-bold ${getRiskScoreColor(
                data.overallRiskScore
              )}`}
            >
              {data.overallRiskScore}/100
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getRiskScoreColor(
                data.overallRiskScore
              )}`}
            >
              {data.overallRiskScore}
            </div>
            <p className="text-xs text-muted-foreground">Lower is better</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dependencies</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalDependencies}
            </div>
            <p className="text-xs text-muted-foreground">
              Total packages analyzed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Risk Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="font-medium">
                  {data.summary.highRisk}
                </span>{" "}
                High
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span className="font-medium">
                  {data.summary.mediumRisk}
                </span>{" "}
                Med
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="font-medium">{data.summary.lowRisk}</span> Low
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <AISummaryCard summary={data.aiSummary} />

      {/* Dependencies Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Dependency Analysis
        </h2>
        <DependencyTable data={data.dependencies} />
      </div>

      <Separator />

      {/* Limitations */}
      <div className="text-center text-sm text-muted-foreground py-4">
        <p>{data.analysisLimitations}</p>
      </div>
    </div>
  );
}
