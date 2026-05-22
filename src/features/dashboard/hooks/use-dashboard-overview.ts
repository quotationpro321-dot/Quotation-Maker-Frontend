"use client";

import type { TDashboardOverview } from "@/types/dashboard-overview.type";
import type { UserRole } from "@/types/user.type";

import { getMockDashboardOverview } from "@/features/dashboard/lib/dashboard-mock-data";

type TDashboardOverviewState = {
  data: TDashboardOverview | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function useDashboardOverview(role: UserRole): TDashboardOverviewState {
  // Phase 1: mock data. Swap to useGetDashboardOverviewQuery when backend is ready.
  return {
    data: getMockDashboardOverview(role),
    isLoading: false,
    isError: false,
  };
}
