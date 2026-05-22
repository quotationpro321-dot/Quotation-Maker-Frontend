"use client";

import { useState } from "react";

import type { TAnalyticsPeriod } from "@/types/analytics-overview.type";

import { useAnalyticsOverview } from "@/features/analytics/hooks/use-analytics-overview";
import { AnalyticsKpiGrid } from "@/features/analytics/ui/analytics-kpi-grid";
import { AnalyticsLoadingSkeleton } from "@/features/analytics/ui/analytics-loading-skeleton";
import { AnalyticsPeriodToggle } from "@/features/analytics/ui/analytics-period-toggle";
import { FlightConverterAreaChart } from "@/features/analytics/ui/flight-converter-area-chart";
import { QuotationStatusPieChart } from "@/features/analytics/ui/quotation-status-pie-chart";
import { QuotationVolumeAreaChart } from "@/features/analytics/ui/quotation-volume-area-chart";
import { RevenueBarChart } from "@/features/analytics/ui/revenue-bar-chart";
import { TopAgentsBarChart } from "@/features/analytics/ui/top-agents-bar-chart";
import { TopAgentsTable } from "@/features/analytics/ui/top-agents-table";
import { DashboardPageHeader } from "@/features/dashboard/ui/dashboard-page-header";

export function AdminAnalyticsView() {
  const [period, setPeriod] = useState<TAnalyticsPeriod>("30d");
  const { data, isLoading, isError } = useAnalyticsOverview(period);

  if (isLoading) return <AnalyticsLoadingSkeleton />;

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Unable to load analytics overview. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Analytics"
        subtitle="Quotation performance, revenue trends, agent activity, and flight converter adoption."
        action={
          <AnalyticsPeriodToggle value={period} onChange={setPeriod} />
        }
      />

      <AnalyticsKpiGrid kpis={data.kpis} featuredKey="totalRevenue" />

      <QuotationVolumeAreaChart data={data.quotationVolume} />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <QuotationStatusPieChart data={data.statusBreakdown} />
        </div>
        <div className="xl:col-span-7">
          <RevenueBarChart data={data.revenueTrend} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <TopAgentsBarChart agents={data.topAgents} />
        </div>
        <div className="xl:col-span-7">
          <FlightConverterAreaChart data={data.flightConverterUsage} />
        </div>
      </div>

      <TopAgentsTable agents={data.topAgents} />
    </div>
  );
}
