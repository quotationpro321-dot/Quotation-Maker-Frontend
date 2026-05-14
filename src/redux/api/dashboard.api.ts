import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
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
  }),
});

export const {
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadMyProfileAvatarMutation,
  useChangeMyPasswordMutation,
} = dashboardApi;
