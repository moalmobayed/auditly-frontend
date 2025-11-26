import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Dependency } from "@/types/auditly";
import { RiskBadge } from "./risk-badge";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface DependencyDetailsProps {
  dependency: Dependency | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DependencyDetails({
  dependency,
  open,
  onOpenChange,
}: DependencyDetailsProps) {
  if (!dependency) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">
              {dependency.name}
            </SheetTitle>
            <RiskBadge level={dependency.riskLevel} />
          </div>
          <SheetDescription className="text-base">
            Version {dependency.version} • {dependency.license}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Recommendation */}
          <div className="p-4 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              Recommendation:{" "}
              <span className="text-primary">
                {dependency.recommendation.action}
              </span>
            </h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {dependency.recommendation.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Issues */}
          <div>
            <h3 className="font-semibold mb-3">
              Issues Detected ({dependency.issues.length})
            </h3>
            {dependency.issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No specific issues detected.
              </p>
            ) : (
              <div className="space-y-4">
                {dependency.issues.map((issue, i) => (
                  <div key={i} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{issue.title}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {issue.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {issue.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        <span className="font-semibold block text-red-700 dark:text-red-400">
                          Legal Impact
                        </span>
                        <span className="text-red-600 dark:text-red-300">
                          {issue.legalImpact}
                        </span>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                        <span className="font-semibold block text-orange-700 dark:text-orange-400">
                          Business Impact
                        </span>
                        <span className="text-orange-600 dark:text-orange-300">
                          {issue.businessImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Impact Analysis */}
          <div>
            <h3 className="font-semibold mb-3">Impact Analysis</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Legal
                </div>
                <div className="font-medium">{dependency.impact.legal}</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Business
                </div>
                <div className="font-medium">{dependency.impact.business}</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Technical
                </div>
                <div className="font-medium">{dependency.impact.technical}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Severity Score</span>
              <span className="text-xl font-bold">
                {dependency.impact.severityScore}/100
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
