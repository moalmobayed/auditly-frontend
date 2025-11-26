import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { AISummary } from "@/types/auditly";

interface AISummaryCardProps {
  summary: AISummary;
}

export function AISummaryCard({ summary }: AISummaryCardProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <CardTitle className="text-lg font-semibold text-primary">
          AI Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary.narrative}
        </p>
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Recommended Next Steps:
          </h4>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
            {summary.recommendedNextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
