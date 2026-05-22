"use client";

import { cn } from "@/lib/utils";
import type { TAnalyticsPeriod } from "@/types/analytics-overview.type";

const PERIOD_LABELS: Record<TAnalyticsPeriod, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  "12m": "12 months",
};

type TAnalyticsPeriodToggleProps = {
  value: TAnalyticsPeriod;
  onChange: (period: TAnalyticsPeriod) => void;
};

export function AnalyticsPeriodToggle({
  value,
  onChange,
}: TAnalyticsPeriodToggleProps) {
  return (
    <div className="inline-flex rounded! border border-border bg-muted/40 p-1">
      {(Object.keys(PERIOD_LABELS) as TAnalyticsPeriod[]).map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={cn(
            "rounded! px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
            value === period
              ? "bg-brand-primary text-white shadow-sm dark:bg-brand-primary-500 dark:text-white"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground dark:hover:bg-muted/40",
          )}
        >
          {PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
}
