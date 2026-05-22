import { formatCurrency } from "@/features/dashboard/lib/format-dashboard";
import type { TAnalyticsKpi } from "@/types/analytics-overview.type";

export function formatKpiValue(kpi: TAnalyticsKpi): string {
  switch (kpi.format) {
    case "currency":
      return formatCurrency(kpi.value, "GBP");
    case "percent":
      return `${kpi.value}%`;
    default:
      return kpi.value.toLocaleString();
  }
}
