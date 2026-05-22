import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { TAnalyticsOverview, TAnalyticsPeriod } from "@/types/analytics-overview.type";
import type { TDashboardOverview } from "@/types/dashboard-overview.type";
import type {
  IDashboardProfile,
  TChangeDashboardPasswordPayload,
  TUpdateDashboardProfilePayload,
} from "@/types/dashboard-profile.type";

const DASHBOARD_URL = "/dashboard";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<IResponse<IDashboardProfile>, void>({
      query: () => ({
        url: `${DASHBOARD_URL}/profile`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateMyProfile: builder.mutation<
      IResponse<IDashboardProfile>,
      TUpdateDashboardProfilePayload
    >({
      query: (body) => ({
        url: `${DASHBOARD_URL}/profile`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),
    uploadMyProfileAvatar: builder.mutation<IResponse<IDashboardProfile>, File>({
      query: (file) => {
        const body = new FormData();
        body.append("avatar", file);
        return {
          url: `${DASHBOARD_URL}/profile/avatar`,
          method: "POST",
          data: body,
        };
      },
    }),
    changeMyPassword: builder.mutation<
      IResponse<null>,
      TChangeDashboardPasswordPayload
    >({
      query: (body) => ({
        url: `${DASHBOARD_URL}/profile/password`,
        method: "PATCH",
        data: body,
      }),
    }),

    /**
     * Future backend contract — wire in `useDashboardOverview` when ready.
     * GET /dashboard/overview → stats, trends, activity, recent quotations.
     */
    getDashboardOverview: builder.query<IResponse<TDashboardOverview>, void>({
      query: () => ({
        url: `${DASHBOARD_URL}/overview`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),

    /**
     * Future backend contract — wire in `useAnalyticsOverview` when ready.
     * GET /dashboard/analytics?period=30d
     */
    getAnalyticsOverview: builder.query<
      IResponse<TAnalyticsOverview>,
      { period: TAnalyticsPeriod }
    >({
      query: ({ period }) => ({
        url: `${DASHBOARD_URL}/analytics`,
        method: "GET",
        params: { period },
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadMyProfileAvatarMutation,
  useChangeMyPasswordMutation,
  useGetDashboardOverviewQuery,
  useGetAnalyticsOverviewQuery,
} = dashboardApi;
