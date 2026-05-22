"use client";

import type { TAnalyticsOverview, TAnalyticsPeriod } from "@/types/analytics-overview.type";

import { getMockAnalyticsOverview } from "@/features/analytics/lib/analytics-mock-data";

type TAnalyticsOverviewState = {
  data: TAnalyticsOverview | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function useAnalyticsOverview(
  period: TAnalyticsPeriod,
): TAnalyticsOverviewState {
  // Phase 1: mock data. Swap to useGetAnalyticsOverviewQuery({ period }) when ready.
  return {
    data: getMockAnalyticsOverview(period),
    isLoading: false,
    isError: false,
  };
}
