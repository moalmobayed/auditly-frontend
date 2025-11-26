import { RiskLevel } from "@/types/auditly";

export const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case "high":
      return "destructive"; // Red
    case "medium":
      return "secondary"; // Yellow/Orange (using secondary or custom class)
    case "low":
      return "default"; // Green (using default or custom class)
    default:
      return "secondary";
  }
};

export const getRiskBadgeVariant = (
  level: RiskLevel
): "default" | "secondary" | "destructive" | "outline" => {
  switch (level) {
    case "high":
      return "destructive";
    case "medium":
      return "secondary"; // We might want to style this as yellow
    case "low":
      return "default"; // We might want to style this as green
    default:
      return "outline";
  }
};

export const getRiskScoreColor = (score: number) => {
  if (score >= 80) return "text-red-500";
  if (score >= 50) return "text-yellow-500";
  return "text-green-500";
};
