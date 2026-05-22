export type TDashboardStat = {
  key: string;
  label: string;
  value: number;
  trendPercent?: number;
  trendLabel?: string;
  href?: string;
};

export type TQuotationTrendPoint = {
  label: string;
  quotations: number;
};

export type TDashboardActivity = {
  id: string;
  actorName: string;
  actorInitials: string;
  action: string;
  reference?: string;
  createdAt: string;
};

export type TDashboardQuotationStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "cancelled";

export type TDashboardQuotationRow = {
  id: string;
  reference: string;
  clientName: string;
  status: TDashboardQuotationStatus;
  value: number;
  currency: string;
};

export type TDashboardOverview = {
  stats: TDashboardStat[];
  quotationTrendWeekly: TQuotationTrendPoint[];
  quotationTrendMonthly: TQuotationTrendPoint[];
  recentActivity: TDashboardActivity[];
  recentQuotations: TDashboardQuotationRow[];
};
