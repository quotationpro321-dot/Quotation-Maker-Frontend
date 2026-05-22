import type { UserRole } from "@/types/user.type";

export const dashboardPaths = {
  admin: {
    home: "/dashboard/admin",
    allQuotation: "/dashboard/admin/all-quotation",
    analytics: "/dashboard/admin/analytics",
    calculator: "/dashboard/admin/calculator",
    flightConverter: "/dashboard/admin/flight-converter",
    myQuotation: "/dashboard/admin/my-quotation",
    users: "/dashboard/admin/users",
    settings: "/dashboard/admin/settings",
  },
  employee: {
    home: "/dashboard/employee",
    calculator: "/dashboard/employee/calculator",
    flightConverter: "/dashboard/employee/flight-converter",
    myQuotation: "/dashboard/employee/my-quotation",
    settings: "/dashboard/employee/settings",
  },
} as const;

export function getDashboardPaths(role: "admin"): (typeof dashboardPaths)["admin"];
export function getDashboardPaths(
  role: "employee",
): (typeof dashboardPaths)["employee"];
export function getDashboardPaths(role: UserRole) {
  return dashboardPaths[role];
}
