import type {
  TAnalyticsAgentRow,
  TAnalyticsFlightUsagePoint,
  TAnalyticsKpi,
  TAnalyticsOverview,
  TAnalyticsPeriod,
  TAnalyticsStatusSlice,
  TAnalyticsTrendPoint,
} from "@/types/analytics-overview.type";

const TOP_AGENTS: TAnalyticsAgentRow[] = [
  {
    id: "agent-1",
    name: "Nobin Chowdhury",
    quotations: 42,
    confirmed: 31,
    revenue: 98400,
    currency: "GBP",
  },
  {
    id: "agent-2",
    name: "Sarah Ahmed",
    quotations: 38,
    confirmed: 29,
    revenue: 87200,
    currency: "GBP",
  },
  {
    id: "agent-3",
    name: "James Wilson",
    quotations: 31,
    confirmed: 22,
    revenue: 71500,
    currency: "GBP",
  },
  {
    id: "agent-4",
    name: "Emma Thompson",
    quotations: 24,
    confirmed: 18,
    revenue: 54800,
    currency: "GBP",
  },
  {
    id: "agent-5",
    name: "Ali Hassan",
    quotations: 19,
    confirmed: 14,
    revenue: 42100,
    currency: "GBP",
  },
];

const STATUS_BASE: TAnalyticsStatusSlice[] = [
  { status: "confirmed", count: 96 },
  { status: "pending", count: 28 },
  { status: "draft", count: 18 },
  { status: "cancelled", count: 6 },
];

const PERIOD_SCALE: Record<TAnalyticsPeriod, number> = {
  "7d": 1,
  "30d": 1.35,
  "90d": 1.75,
  "12m": 2.4,
};

const TREND_BY_PERIOD: Record<TAnalyticsPeriod, TAnalyticsTrendPoint[]> = {
  "7d": [
    { label: "Mon", quotations: 3, revenue: 7200 },
    { label: "Tue", quotations: 5, revenue: 11800 },
    { label: "Wed", quotations: 4, revenue: 9600 },
    { label: "Thu", quotations: 6, revenue: 14200 },
    { label: "Fri", quotations: 8, revenue: 18900 },
    { label: "Sat", quotations: 2, revenue: 5100 },
    { label: "Sun", quotations: 3, revenue: 6800 },
  ],
  "30d": [
    { label: "Week 1", quotations: 18, revenue: 42800 },
    { label: "Week 2", quotations: 22, revenue: 51200 },
    { label: "Week 3", quotations: 20, revenue: 47600 },
    { label: "Week 4", quotations: 26, revenue: 62400 },
  ],
  "90d": [
    { label: "Jan W1", quotations: 14, revenue: 33200 },
    { label: "Jan W3", quotations: 19, revenue: 44800 },
    { label: "Feb W1", quotations: 21, revenue: 49600 },
    { label: "Feb W3", quotations: 24, revenue: 56800 },
    { label: "Mar W1", quotations: 27, revenue: 64200 },
    { label: "Mar W3", quotations: 30, revenue: 71200 },
  ],
  "12m": [
    { label: "Apr", quotations: 52, revenue: 124000 },
    { label: "May", quotations: 58, revenue: 138400 },
    { label: "Jun", quotations: 61, revenue: 145200 },
    { label: "Jul", quotations: 64, revenue: 152800 },
    { label: "Aug", quotations: 59, revenue: 140600 },
    { label: "Sep", quotations: 67, revenue: 159800 },
    { label: "Oct", quotations: 72, revenue: 171200 },
    { label: "Nov", quotations: 68, revenue: 162400 },
    { label: "Dec", quotations: 74, revenue: 176800 },
    { label: "Jan", quotations: 78, revenue: 186400 },
    { label: "Feb", quotations: 82, revenue: 195600 },
    { label: "Mar", quotations: 86, revenue: 204800 },
  ],
};

const FLIGHT_USAGE_BY_PERIOD: Record<TAnalyticsPeriod, TAnalyticsFlightUsagePoint[]> =
  {
    "7d": [
      { label: "Mon", parses: 4 },
      { label: "Tue", parses: 7 },
      { label: "Wed", parses: 5 },
      { label: "Thu", parses: 9 },
      { label: "Fri", parses: 11 },
      { label: "Sat", parses: 3 },
      { label: "Sun", parses: 4 },
    ],
    "30d": [
      { label: "Week 1", parses: 28 },
      { label: "Week 2", parses: 34 },
      { label: "Week 3", parses: 31 },
      { label: "Week 4", parses: 39 },
    ],
    "90d": [
      { label: "Jan W1", parses: 22 },
      { label: "Jan W3", parses: 26 },
      { label: "Feb W1", parses: 29 },
      { label: "Feb W3", parses: 33 },
      { label: "Mar W1", parses: 36 },
      { label: "Mar W3", parses: 41 },
    ],
    "12m": [
      { label: "Apr", parses: 88 },
      { label: "May", parses: 96 },
      { label: "Jun", parses: 102 },
      { label: "Jul", parses: 108 },
      { label: "Aug", parses: 98 },
      { label: "Sep", parses: 114 },
      { label: "Oct", parses: 122 },
      { label: "Nov", parses: 118 },
      { label: "Dec", parses: 126 },
      { label: "Jan", parses: 134 },
      { label: "Feb", parses: 141 },
      { label: "Mar", parses: 148 },
    ],
  };

function buildKpis(period: TAnalyticsPeriod): TAnalyticsKpi[] {
  const scale = PERIOD_SCALE[period];

  return [
    {
      key: "conversionRate",
      label: "Conversion Rate",
      value: Math.round(68 * (1 + (scale - 1) * 0.05)),
      trendPercent: 4,
      trendLabel: "vs previous period",
      format: "percent",
    },
    {
      key: "avgDealValue",
      label: "Avg Deal Value",
      value: Math.round(2480 * scale),
      trendPercent: 6,
      trendLabel: "vs previous period",
      format: "currency",
    },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      value: Math.round(204800 * scale),
      trendPercent: 12,
      trendLabel: "vs previous period",
      format: "currency",
    },
    {
      key: "gdsParses",
      label: "GDS Parses",
      value: Math.round(148 * scale),
      trendPercent: 9,
      trendLabel: "vs previous period",
      format: "number",
    },
  ];
}

function scaleStatusBreakdown(period: TAnalyticsPeriod): TAnalyticsStatusSlice[] {
  const scale = PERIOD_SCALE[period];
  return STATUS_BASE.map((slice) => ({
    ...slice,
    count: Math.round(slice.count * scale),
  }));
}

function scaleAgents(period: TAnalyticsPeriod): TAnalyticsAgentRow[] {
  const scale = PERIOD_SCALE[period];
  return TOP_AGENTS.map((agent) => ({
    ...agent,
    quotations: Math.round(agent.quotations * scale),
    confirmed: Math.round(agent.confirmed * scale),
    revenue: Math.round(agent.revenue * scale),
  }));
}

export function getMockAnalyticsOverview(
  period: TAnalyticsPeriod,
): TAnalyticsOverview {
  const quotationVolume = TREND_BY_PERIOD[period];

  return {
    kpis: buildKpis(period),
    quotationVolume,
    revenueTrend: quotationVolume.map((point) => ({
      label: point.label,
      quotations: point.quotations,
      revenue: point.revenue,
    })),
    statusBreakdown: scaleStatusBreakdown(period),
    topAgents: scaleAgents(period),
    flightConverterUsage: FLIGHT_USAGE_BY_PERIOD[period],
  };
}
