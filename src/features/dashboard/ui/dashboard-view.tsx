"use client";

import { useUser } from "@/hooks/useUser";
import type { UserRole } from "@/types/user.type";

import { AdminDashboardView } from "@/features/dashboard/ui/admin-dashboard-view";
import { EmployeeDashboardView } from "@/features/dashboard/ui/employee-dashboard-view";

type TDashboardViewProps = {
  expectedRole: UserRole;
};

export function DashboardView({ expectedRole }: TDashboardViewProps) {
  const { role } = useUser();
  const activeRole = role ?? expectedRole;

  if (activeRole === "admin") {
    return <AdminDashboardView />;
  }

  return <EmployeeDashboardView />;
}
