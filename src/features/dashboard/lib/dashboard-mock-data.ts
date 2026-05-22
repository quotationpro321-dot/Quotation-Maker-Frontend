import type { TDashboardOverview } from "@/types/dashboard-overview.type";
import type { UserRole } from "@/types/user.type";

import { getDashboardPaths } from "./dashboard-paths";

const WEEKLY_TREND = [
  { label: "Sat", quotations: 1 },
  { label: "Sun", quotations: 0 },
  { label: "Mon", quotations: 2 },
  { label: "Tue", quotations: 1 },
  { label: "Wed", quotations: 3 },
  { label: "Thu", quotations: 2 },
  { label: "Fri", quotations: 4 },
];

const MONTHLY_TREND = [
  { label: "Week 1", quotations: 6 },
  { label: "Week 2", quotations: 9 },
  { label: "Week 3", quotations: 7 },
  { label: "Week 4", quotations: 12 },
];

const SHARED_ACTIVITY = [
  {
    id: "act-1",
    actorName: "Nobin Chowdhury",
    actorInitials: "NC",
    action: "created quotation",
    reference: "#7a8b",
    createdAt: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    id: "act-2",
    actorName: "Sarah Ahmed",
    actorInitials: "SA",
    action: "confirmed deal",
    reference: "#6f21",
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: "act-3",
    actorName: "James Wilson",
    actorInitials: "JW",
    action: "converted GDS itinerary",
    reference: "QR104",
    createdAt: new Date(Date.now() - 5 * 3_600_000).toISOString(),
  },
  {
    id: "act-4",
    actorName: "Admin User",
    actorInitials: "AU",
    action: "invited new employee",
    createdAt: new Date(Date.now() - 26 * 3_600_000).toISOString(),
  },
];

const SHARED_QUOTATIONS = [
  {
    id: "q-1",
    reference: "#7a8b",
    clientName: "Nobin Chowdhury",
    status: "pending" as const,
    value: 2495,
    currency: "GBP",
  },
  {
    id: "q-2",
    reference: "#6f21",
    clientName: "Sarah Ahmed",
    status: "confirmed" as const,
    value: 4180,
    currency: "GBP",
  },
  {
    id: "q-3",
    reference: "#5c14",
    clientName: "James Wilson",
    status: "draft" as const,
    value: 1890,
    currency: "GBP",
  },
  {
    id: "q-4",
    reference: "#4b09",
    clientName: "Emma Thompson",
    status: "cancelled" as const,
    value: 920,
    currency: "GBP",
  },
];

function buildAdminOverview(): TDashboardOverview {
  const paths = getDashboardPaths("admin");

  return {
    stats: [
      {
        key: "totalUsers",
        label: "Total Users",
        value: 24,
        trendPercent: 8,
        trendLabel: "vs last month",
        href: paths.users,
      },
      {
        key: "totalAdmins",
        label: "Total Admins",
        value: 3,
        trendPercent: 0,
        trendLabel: "vs last month",
        href: paths.users,
      },
      {
        key: "totalEmployees",
        label: "Total Employees",
        value: 21,
        trendPercent: 12,
        trendLabel: "vs last month",
        href: paths.users,
      },
      {
        key: "totalQuotations",
        label: "Total Quotations",
        value: 148,
        trendPercent: 14,
        trendLabel: "vs last month",
        href: paths.allQuotation,
      },
      {
        key: "pendingApproval",
        label: "Pending Approval",
        value: 12,
        trendPercent: 5,
        trendLabel: "vs last week",
        href: paths.allQuotation,
      },
      {
        key: "confirmedDeals",
        label: "Confirmed Deals",
        value: 96,
        trendPercent: 18,
        trendLabel: "vs last month",
        href: paths.allQuotation,
      },
      {
        key: "activeAgents",
        label: "Active Agents",
        value: 18,
        trendPercent: 6,
        trendLabel: "vs last month",
        href: paths.users,
      },
    ],
    quotationTrendWeekly: WEEKLY_TREND,
    quotationTrendMonthly: MONTHLY_TREND,
    recentActivity: SHARED_ACTIVITY,
    recentQuotations: SHARED_QUOTATIONS,
  };
}

function buildEmployeeOverview(): TDashboardOverview {
  const paths = getDashboardPaths("employee");

  return {
    stats: [
      {
        key: "myQuotations",
        label: "My Quotations",
        value: 14,
        trendPercent: 10,
        trendLabel: "vs last month",
        href: paths.myQuotation,
      },
      {
        key: "pendingApproval",
        label: "Pending Approval",
        value: 3,
        trendPercent: 2,
        trendLabel: "vs last week",
        href: paths.myQuotation,
      },
      {
        key: "confirmedDeals",
        label: "Confirmed Deals",
        value: 9,
        trendPercent: 15,
        trendLabel: "vs last month",
        href: paths.myQuotation,
      },
      {
        key: "drafts",
        label: "Drafts",
        value: 2,
        trendPercent: -4,
        trendLabel: "vs last week",
        href: paths.myQuotation,
      },
    ],
    quotationTrendWeekly: [
      { label: "Sat", quotations: 0 },
      { label: "Sun", quotations: 1 },
      { label: "Mon", quotations: 1 },
      { label: "Tue", quotations: 2 },
      { label: "Wed", quotations: 0 },
      { label: "Thu", quotations: 1 },
      { label: "Fri", quotations: 2 },
    ],
    quotationTrendMonthly: [
      { label: "Week 1", quotations: 2 },
      { label: "Week 2", quotations: 4 },
      { label: "Week 3", quotations: 3 },
      { label: "Week 4", quotations: 5 },
    ],
    recentActivity: SHARED_ACTIVITY.slice(0, 3).map((item) => ({
      ...item,
      actorName: "You",
      actorInitials: "YO",
    })),
    recentQuotations: SHARED_QUOTATIONS.slice(0, 3),
  };
}

export function getMockDashboardOverview(role: UserRole): TDashboardOverview {
  return role === "admin" ? buildAdminOverview() : buildEmployeeOverview();
}
