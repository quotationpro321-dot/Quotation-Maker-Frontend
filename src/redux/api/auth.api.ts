import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";
import { ILogin } from "@/types/auth.type";

const AUTH_URL = "/auth";

type ILoginResponseData = {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  role?: string;
  user?: {
    role?: string;
  } | null;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IResponse<ILoginResponseData>, ILogin>({
      query: (userInfo) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        data: userInfo,
      }),
    }),
    logout: builder.mutation<IResponse<null>, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;
