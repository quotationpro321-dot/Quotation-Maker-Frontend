"use client";

import Link from "next/link";
import {
  BarChart3,
  Calculator,
  FolderOpen,
  Plane,
  Settings,
  Users,
} from "lucide-react";

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

export function AdminDashboardView() {
  const paths = getDashboardPaths("admin");
  const { data, isLoading, isError } = useDashboardOverview("admin");

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
        title="Agency Intelligence"
        subtitle="Real-time synchronization with global travel networks and quotation workflows."
        action={
          <Button
            asChild
            className="rounded! border-transparent bg-brand-primary! font-medium text-white! hover:bg-brand-primary-700!"
          >
            <Link href={paths.allQuotation}>View all quotations</Link>
          </Button>
        }
      />

      <StatCardsGrid stats={data.stats} featuredKey="totalQuotations" />

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <QuotationVelocityChart
            weeklyData={data.quotationTrendWeekly}
            monthlyData={data.quotationTrendMonthly}
            description="Volume analysis for the current week."
          />
        </div>
        <div className="xl:col-span-4">
          <RecentActivityFeed
            items={data.recentActivity}
            viewAllHref={paths.analytics}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <GdsIntelligencePanel flightConverterHref={paths.flightConverter} />
        </div>
        <div className="xl:col-span-7">
          <RecentQuotationsTable
            rows={data.recentQuotations}
            reportHref={paths.allQuotation}
          />
        </div>
      </div>

      <QuickActionsPanel
        actions={[
          {
            label: "Manage Users",
            description: "Add, edit, and restore team accounts.",
            href: paths.users,
            icon: Users,
          },
          {
            label: "All Quotation",
            description: "Browse every quotation in the agency.",
            href: paths.allQuotation,
            icon: FolderOpen,
          },
          {
            label: "Analytics",
            description: "Review performance and conversion trends.",
            href: paths.analytics,
            icon: BarChart3,
          },
          {
            label: "Flight Converter",
            description: "Convert GDS text into itinerary output.",
            href: paths.flightConverter,
            icon: Plane,
          },
        ]}
      />
    </div>
  );
}
