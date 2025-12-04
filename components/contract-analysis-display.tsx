"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { ContractAnalysis, Severity, ContractIssue } from "@/types/contract";

interface ContractAnalysisDisplayProps {
  analysis: ContractAnalysis;
}

function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case Severity.Critical:
      return "bg-red-500 hover:bg-red-600";
    case Severity.High:
      return "bg-orange-500 hover:bg-orange-600";
    case Severity.Medium:
      return "bg-yellow-500 hover:bg-yellow-600";
    case Severity.Low:
      return "bg-blue-500 hover:bg-blue-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

function getSeverityIcon(severity: Severity) {
  switch (severity) {
    case Severity.Critical:
      return <ShieldAlert className="h-4 w-4" />;
    case Severity.High:
      return <AlertTriangle className="h-4 w-4" />;
    case Severity.Medium:
      return <AlertCircle className="h-4 w-4" />;
    case Severity.Low:
      return <Info className="h-4 w-4" />;
  }
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case "critical":
      return "border-red-500 bg-red-500/10";
    case "high":
      return "border-orange-500 bg-orange-500/10";
    case "moderate":
      return "border-yellow-500 bg-yellow-500/10";
    case "low":
      return "border-green-500 bg-green-500/10";
    default:
      return "";
  }
}

function IssueCard({ issue }: { issue: ContractIssue }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 text-right flex-1">
                <div className="mt-1">{getSeverityIcon(issue.severity)}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 text-arabic-auto">
                    {issue.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-arabic-auto">
                    {issue.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getSeverityColor(issue.severity)}>
                  {getSeverityText(issue.severity)}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <Separator />

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                تفاصيل المشكلة
              </h4>
              <p className="text-sm text-muted-foreground text-arabic-auto">
                {issue.description}
              </p>
            </div>

            {/* Egyptian Law Reference */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                مرجع القانون المصري
              </h4>
              <div className="space-y-1 text-sm">
                <p className="text-arabic-auto">
                  <span className="font-medium">القانون: </span>
                  {issue.egyptianLawReference.lawName}
                </p>
                <p className="text-arabic-auto">
                  <span className="font-medium">المادة: </span>
                  {issue.egyptianLawReference.article}
                </p>
                {issue.egyptianLawReference.articleText && (
                  <p className="mt-2 text-muted-foreground italic text-arabic-auto">
                    &quot;{issue.egyptianLawReference.articleText}&quot;
                  </p>
                )}
              </div>
            </div>

            {/* Affected Clause */}
            {issue.affectedClause && (
              <div>
                <h4 className="text-sm font-semibold mb-2">البند المتأثر</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded border-r-4 border-primary text-arabic-auto">
                  {issue.affectedClause}
                </p>
              </div>
            )}

            {/* Suggestion */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                التوصية
              </h4>
              <p className="text-sm text-muted-foreground text-arabic-auto">
                {issue.suggestion}
              </p>
            </div>

            {/* Fix Example */}
            {issue.fixExample && (
              <div>
                <h4 className="text-sm font-semibold mb-2">الحل المقترح</h4>
                <pre className="text-sm bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap text-arabic-auto">
                  {issue.fixExample}
                </pre>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function IssueSection({
  title,
  issues,
  severity,
  count,
}: {
  title: string;
  issues: ContractIssue[];
  severity: Severity;
  count: number;
}) {
  if (count === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge className={getSeverityColor(severity)} variant="default">
          {count}
        </Badge>
      </div>
      <div className="space-y-3">
        {issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}

// Arabic translations for severity levels
const getSeverityText = (severity: Severity): string => {
  switch (severity) {
    case Severity.Critical:
      return "حرج";
    case Severity.High:
      return "عالي";
    case Severity.Medium:
      return "متوسط";
    case Severity.Low:
      return "منخفض";
    default:
      return severity;
  }
};

// Arabic translations for risk levels
const getRiskText = (risk: string): string => {
  switch (risk) {
    case "critical":
      return "حرج";
    case "high":
      return "عالي";
    case "moderate":
      return "متوسط";
    case "low":
      return "منخفض";
    default:
      return risk;
  }
};

export function ContractAnalysisDisplay({
  analysis,
}: ContractAnalysisDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className={getRiskColor(analysis.summary.overallRisk)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">ملخص التحليل</CardTitle>
              <CardDescription>
                بناءً على القانون المدني المصري والقانون التجاري وقانون العمل
              </CardDescription>
            </div>
            <div className="text-left">
              <div className="text-3xl font-bold">
                {analysis.summary.totalIssues}
              </div>
              <div className="text-sm text-muted-foreground">
                إجمالي المشاكل
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Issue Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-2xl font-bold text-red-500">
                {analysis.summary.criticalCount}
              </div>
              <div className="text-xs text-muted-foreground">حرج</div>
            </div>
            <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-500">
                {analysis.summary.highCount}
              </div>
              <div className="text-xs text-muted-foreground">عالي</div>
            </div>
            <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-500">
                {analysis.summary.mediumCount}
              </div>
              <div className="text-xs text-muted-foreground">متوسط</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-500">
                {analysis.summary.lowCount}
              </div>
              <div className="text-xs text-muted-foreground">منخفض</div>
            </div>
          </div>

          <Separator />

          {/* General Insights */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              الرؤى العامة
            </h4>
            <p className="text-sm text-muted-foreground text-arabic-auto">
              {analysis.generalInsights}
            </p>
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                التوصيات الرئيسية
              </h4>
              <ul className="space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2 text-arabic-auto"
                  >
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Risk Alert */}
      <Alert className={getRiskColor(analysis.summary.overallRisk)}>
        {analysis.summary.overallRisk === "critical" ||
        analysis.summary.overallRisk === "high" ? (
          <AlertTriangle className="h-4 w-4" />
        ) : (
          <Info className="h-4 w-4" />
        )}
        <AlertTitle>
          مستوى المخاطر الإجمالي: {getRiskText(analysis.summary.overallRisk)}
        </AlertTitle>
        <AlertDescription>
          {analysis.summary.overallRisk === "critical" &&
            "هذا العقد يحتوي على مشاكل قانونية حرجة يجب معالجتها فوراً."}
          {analysis.summary.overallRisk === "high" &&
            "هذا العقد يحتوي على مشاكل كبيرة يجب مراجعتها من قبل محامي متخصص."}
          {analysis.summary.overallRisk === "moderate" &&
            "هذا العقد يحتوي على بعض المخاوف التي يجب معالجتها لتحقيق امتثال أفضل."}
          {analysis.summary.overallRisk === "low" &&
            "يبدو أن هذا العقد متوافق بشكل عام مع اقتراح تحسينات طفيفة."}
        </AlertDescription>
      </Alert>

      {/* Issues by Severity */}
      <div className="space-y-6">
        <IssueSection
          title="المشاكل الحرجة"
          issues={analysis.issues.critical}
          severity={Severity.Critical}
          count={analysis.summary.criticalCount}
        />
        <IssueSection
          title="مشاكل ذات أولوية عالية"
          issues={analysis.issues.high}
          severity={Severity.High}
          count={analysis.summary.highCount}
        />
        <IssueSection
          title="مشاكل ذات أولوية متوسطة"
          issues={analysis.issues.medium}
          severity={Severity.Medium}
          count={analysis.summary.mediumCount}
        />
        <IssueSection
          title="مشاكل ذات أولوية منخفضة"
          issues={analysis.issues.low}
          severity={Severity.Low}
          count={analysis.summary.lowCount}
        />
      </div>

      {/* No Issues Message */}
      {analysis.summary.totalIssues === 0 && (
        <Alert className="border-green-500 bg-green-500/10">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">
            لم يتم العثور على مشاكل
          </AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-400">
            يبدو أن العقد متوافق مع القانون المصري. ومع ذلك، يُنصح دائماً
            بمراجعة العقود المهمة من قبل محامي متخصص.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
