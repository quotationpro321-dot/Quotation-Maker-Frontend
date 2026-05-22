import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TDashboardStat } from "@/types/dashboard-overview.type";

import { formatTrendPercent } from "@/features/dashboard/lib/format-dashboard";

type TStatCardProps = {
  stat: TDashboardStat;
  icon: LucideIcon;
  accentClassName?: string;
  featured?: boolean;
  formattedValue?: string;
};

export function StatCard({
  stat,
  icon: Icon,
  accentClassName,
  featured = false,
  formattedValue,
}: TStatCardProps) {
  const trendUp = (stat.trendPercent ?? 0) >= 0;
  const TrendIcon = trendUp ? TrendingUp : TrendingDown;

  const content = (
    <Card
      className={cn(
        "rounded! border-border shadow-sm transition-colors",
        featured && "border-brand-primary/20 bg-brand-primary text-white",
        !featured && "hover:border-brand-primary/30",
      )}
    >
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded!",
              featured
                ? "bg-white/15 text-white"
                : cn("bg-muted text-brand-primary", accentClassName),
            )}
          >
            <Icon className="size-5" aria-hidden />
          </div>
          {stat.trendPercent !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded! px-2 py-0.5 text-xs font-medium",
                featured
                  ? "bg-white/15 text-white"
                  : trendUp
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400",
              )}
            >
              <TrendIcon className="size-3" aria-hidden />
              {formatTrendPercent(stat.trendPercent)}
            </span>
          )}
        </div>
        <div className="space-y-1">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              featured ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {stat.label}
          </p>
          <p className="text-3xl font-bold tracking-tight">
            {formattedValue ?? stat.value.toLocaleString()}
          </p>
          {stat.trendLabel && (
            <p
              className={cn(
                "text-xs",
                featured ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {stat.trendLabel}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (stat.href) {
    return (
      <Link href={stat.href} className="block focus-visible:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
