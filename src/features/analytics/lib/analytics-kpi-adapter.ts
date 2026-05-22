import type { TDashboardStat } from "@/types/dashboard-overview.type";
import type { TAnalyticsKpi } from "@/types/analytics-overview.type";

import { formatKpiValue } from "@/features/analytics/lib/analytics-format";

export function analyticsKpiToStat(kpi: TAnalyticsKpi): TDashboardStat {
  return {
    key: kpi.key,
    label: kpi.label,
    value: kpi.value,
    trendPercent: kpi.trendPercent,
    trendLabel: kpi.trendLabel,
  };
}

export function getAnalyticsKpiFormattedValue(kpi: TAnalyticsKpi): string {
  return formatKpiValue(kpi);
}
