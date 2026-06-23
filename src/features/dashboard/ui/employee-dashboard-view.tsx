"use client";

import Link from "next/link";
import { Calculator, FileText, Plane, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDashboardOverview } from "@/features/dashboard/hooks/use-dashboard-overview";
import { getDashboardPaths } from "@/features/dashboard/lib/dashboard-paths";
import { DashboardLoadingSkeleton } from "@/features/dashboard/ui/dashboard-loading-skeleton";
import { DashboardPageHeader } from "@/features/dashboard/ui/dashboard-page-header";
import { GdsIntelligencePanel } from "@/features/dashboard/ui/gds-intelligence-panel";
import { QuickActionsPanel } from "@/features/dashboard/ui/quick-actions-panel";
import { QuotationVelocityChart } from "@/features/dashboard/ui/quotation-velocity-chart";
import { RecentActivityFeed } from "@/features/dashboard/ui/recent-activity-feed";
import { RecentQuotationsTable } from "@/features/dashboard/ui/recent-quotations-table";
import { StatCardsGrid } from "@/features/dashboard/ui/stat-cards-grid";

export function EmployeeDashboardView() {
  const paths = getDashboardPaths("employee");
  const { data, isLoading, isError } = useDashboardOverview("employee");

  if (isLoading) return <DashboardLoadingSkeleton />;

  if (isError || !data) {
    return (
      <p className="text-sm text-destructive">
        Unable to load dashboard overview. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="My Workspace"
        subtitle="Track your quotations, recent activity, and conversion tools in one place."
        action={
          <Button
            asChild
            className="rounded! border-transparent bg-brand-primary! font-medium text-white! hover:bg-brand-primary-700!"
          >
            <Link href={paths.myQuotation}>Create quotation</Link>
          </Button>
        }
      />

      <StatCardsGrid stats={data.stats} featuredKey="myQuotations" />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <QuotationVelocityChart
            weeklyData={data.quotationTrendWeekly}
            monthlyData={data.quotationTrendMonthly}
            title="My Quotation Velocity"
            description="Your quotation volume for the selected period."
          />
        </div>
        <div className="xl:col-span-4">
          <RecentActivityFeed items={data.recentActivity} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <GdsIntelligencePanel flightConverterHref={paths.flightConverter} />
        </div>
        <div className="xl:col-span-7">
          <RecentQuotationsTable
            rows={data.recentQuotations}
            reportHref={paths.myQuotation}
            title="My Recent Deals"
          />
        </div>
      </div>

      <QuickActionsPanel
        actions={[
          {
            label: "Flight Converter",
            description: "Convert raw GDS text into itinerary output.",
            href: paths.flightConverter,
            icon: Plane,
          },
          {
            label: "My Quotation",
            description: "View and manage your quotation pipeline.",
            href: paths.myQuotation,
            icon: FileText,
          },
          {
            label: "Calculator",
            description: "Run fare and margin calculations.",
            href: `${paths.calculator}?new=1`,
            icon: Calculator,
          },
          {
            label: "Settings",
            description: "Update profile and account preferences.",
            href: paths.settings,
            icon: Settings,
          },
        ]}
      />
    </div>
  );
}
