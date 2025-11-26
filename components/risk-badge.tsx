import { Badge } from "@/components/ui/badge";
import { RiskLevel } from "@/types/auditly";
import { getRiskBadgeVariant } from "@/lib/map-risk-level";

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <Badge
      variant={getRiskBadgeVariant(level)}
      className="uppercase text-xs font-bold"
    >
      {level}
    </Badge>
  );
}
