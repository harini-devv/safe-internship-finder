import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: string;
  className?: string;
}

export default function RiskBadge({ level, className }: RiskBadgeProps) {
  const colors: Record<string, string> = {
    low: "bg-success/15 text-success border-success/30",
    medium: "bg-warning/15 text-warning border-warning/30",
    high: "bg-danger/15 text-danger border-danger/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        colors[level.toLowerCase()] || colors.medium,
        className
      )}
    >
      {level}
    </span>
  );
}
