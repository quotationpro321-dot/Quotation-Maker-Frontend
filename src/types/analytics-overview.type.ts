import type { TDashboardQuotationStatus } from "@/types/dashboard-overview.type";

export type TAnalyticsPeriod = "7d" | "30d" | "90d" | "12m";

export type TAnalyticsKpiFormat = "number" | "currency" | "percent";

export type TAnalyticsKpi = {
  key: string;
  label: string;
  value: number;
  trendPercent?: number;
  trendLabel?: string;
  format?: TAnalyticsKpiFormat;
};

export type TAnalyticsTrendPoint = {
  label: string;
  quotations: number;
  revenue: number;
};

export type TAnalyticsStatusSlice = {
  status: TDashboardQuotationStatus;
  count: number;
};

export type TAnalyticsAgentRow = {
  id: string;
  name: string;
  quotations: number;
  confirmed: number;
  revenue: number;
  currency: string;
};

export type TAnalyticsFlightUsagePoint = {
  label: string;
  parses: number;
};

export type TAnalyticsOverview = {
  kpis: TAnalyticsKpi[];
  quotationVolume: TAnalyticsTrendPoint[];
  revenueTrend: TAnalyticsTrendPoint[];
  statusBreakdown: TAnalyticsStatusSlice[];
  topAgents: TAnalyticsAgentRow[];
  flightConverterUsage: TAnalyticsFlightUsagePoint[];
};
