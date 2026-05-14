import type { UserRole } from "@/types/user.type";

export function getDashboardPathByRole(role?: string): string {
  const normalized = role?.trim().toLowerCase();
  if (normalized === "employee") return "/dashboard/employee";
  return "/dashboard/admin";
}

export function normalizeUserRoleForDashboard(role?: string): UserRole {
  return role?.trim().toLowerCase() === "employee" ? "employee" : "admin";
}
