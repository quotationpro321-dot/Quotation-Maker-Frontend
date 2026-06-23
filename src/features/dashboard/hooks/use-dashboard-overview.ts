"use client";

import { useMemo } from "react";

import type { TDashboardOverview } from "@/types/dashboard-overview.type";
import type { UserRole } from "@/types/user.type";

import { enrichDashboardOverview } from "@/features/dashboard/lib/dashboard-overview-adapter";
import { useGetDashboardOverviewQuery } from "@/redux/api/dashboard.api";

type TDashboardOverviewState = {
  data: TDashboardOverview | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export function useDashboardOverview(role: UserRole): TDashboardOverviewState {
  const { data: response, isLoading, isError, refetch } = useGetDashboardOverviewQuery();

  const data = useMemo(() => {
    if (!response?.data) return undefined;
    if (role !== "admin" && role !== "employee") return response.data;
    return enrichDashboardOverview(response.data, role);
  }, [response?.data, role]);

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
