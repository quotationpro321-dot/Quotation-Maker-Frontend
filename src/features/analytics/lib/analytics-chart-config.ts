import type { ChartConfig } from "@/components/ui/chart";

export const quotationVolumeChartConfig = {
  quotations: {
    label: "Quotations",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export const revenueBarChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export const flightUsageChartConfig = {
  parses: {
    label: "GDS Parses",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export const topAgentsBarChartConfig = {
  quotations: {
    label: "Quotations",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export const statusChartConfig = {
  confirmed: { label: "Confirmed", color: "var(--color-chart-1)" },
  pending: { label: "Pending", color: "var(--color-chart-2)" },
  draft: { label: "Draft", color: "var(--color-chart-3)" },
  cancelled: { label: "Cancelled", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

export const STATUS_CHART_COLORS: Record<string, string> = {
  confirmed: "var(--color-chart-1)",
  pending: "var(--color-chart-2)",
  draft: "var(--color-chart-3)",
  cancelled: "var(--color-chart-4)",
};
