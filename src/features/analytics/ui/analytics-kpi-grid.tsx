import type { LucideIcon } from "lucide-react";
import { Percent, Plane, PoundSterling, TrendingUp } from "lucide-react";

import type { TAnalyticsKpi } from "@/types/analytics-overview.type";

import {
  analyticsKpiToStat,
  getAnalyticsKpiFormattedValue,
} from "@/features/analytics/lib/analytics-kpi-adapter";
import { StatCard } from "@/features/dashboard/ui/stat-card";

const KPI_ICONS: Record<string, LucideIcon> = {
  conversionRate: Percent,
  avgDealValue: PoundSterling,
  totalRevenue: TrendingUp,
  gdsParses: Plane,
};

type TAnalyticsKpiGridProps = {
  kpis: TAnalyticsKpi[];
  featuredKey?: string;
};

export function AnalyticsKpiGrid({ kpis, featuredKey }: TAnalyticsKpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <StatCard
          key={kpi.key}
          stat={analyticsKpiToStat(kpi)}
          icon={KPI_ICONS[kpi.key] ?? TrendingUp}
          featured={kpi.key === featuredKey}
          formattedValue={getAnalyticsKpiFormattedValue(kpi)}
        />
      ))}
    </div>
  );
}
