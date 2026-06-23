"use client";

import type { TAnalyticsOverview, TAnalyticsPeriod } from "@/types/analytics-overview.type";

import { useGetAnalyticsOverviewQuery } from "@/redux/api/dashboard.api";

type TAnalyticsOverviewState = {
  data: TAnalyticsOverview | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

export function useAnalyticsOverview(
  period: TAnalyticsPeriod,
): TAnalyticsOverviewState {
  const { data: response, isLoading, isError, refetch } =
    useGetAnalyticsOverviewQuery({ period });

  return {
    data: response?.data,
    isLoading,
    isError,
    refetch,
  };
}
