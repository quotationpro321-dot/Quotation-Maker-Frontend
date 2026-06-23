import type { TDashboardOverview, TDashboardStat } from "@/types/dashboard-overview.type";

import { getDashboardPaths } from "@/features/dashboard/lib/dashboard-paths";

function enrichAdminStats(stats: TDashboardStat[]): TDashboardStat[] {
  const paths = getDashboardPaths("admin");
  const hrefByKey: Record<string, string | undefined> = {
    totalUsers: paths.users,
    totalAdmins: paths.users,
    totalEmployees: paths.users,
    totalQuotations: paths.allQuotation,
    pendingApproval: paths.allQuotation,
    confirmedDeals: paths.allQuotation,
    activeAgents: paths.users,
  };

  return stats.map((stat) => ({
    ...stat,
    href: hrefByKey[stat.key],
  }));
}

function enrichEmployeeStats(stats: TDashboardStat[]): TDashboardStat[] {
  const paths = getDashboardPaths("employee");
  const hrefByKey: Record<string, string | undefined> = {
    myQuotations: paths.myQuotation,
    pendingApproval: paths.myQuotation,
    confirmedDeals: paths.myQuotation,
    drafts: paths.myQuotation,
  };

  return stats.map((stat) => ({
    ...stat,
    href: hrefByKey[stat.key],
  }));
}

export function enrichDashboardOverview(
  overview: TDashboardOverview,
  role: "admin" | "employee",
): TDashboardOverview {
  const actorLabel = role === "employee" ? "You" : undefined;

  return {
    ...overview,
    stats: role === "admin" ? enrichAdminStats(overview.stats) : enrichEmployeeStats(overview.stats),
    recentActivity: actorLabel
      ? overview.recentActivity.map((item) => ({
          ...item,
          actorName: actorLabel,
          actorInitials: "YO",
        }))
      : overview.recentActivity,
  };
}
