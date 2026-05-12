import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";
import { ILogin } from "@/types/auth.type";

const AUTH_URL = "/auth";

/**
 * Backend sets `accessToken` + `refreshToken` as httpOnly cookies (`setAuthCookie`).
 * The client must never store or attach those tokens — only `withCredentials` so
 * cookies flow on API calls. Use `user` (and role) from the JSON body for UI state.
 */
type ILoginResponseData = {
  role?: string;
  user?: {
    _id?: string;
    id?: string;
    email?: string;
    role?: string;
    name?: string;
    profilePhotoUrl?: string;
  } | null;
};

type IForgotPasswordPayload = {
  email: string;
};

type IResetPasswordPayload = {
  code: string;
  newPassword: string;
  confirmPassword: string;
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
    forgotPassword: builder.mutation<IResponse<null>, IForgotPasswordPayload>({
      query: (payload) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        data: payload,
      }),
    }),
    resetPassword: builder.mutation<IResponse<null>, IResetPasswordPayload>({
      query: (payload) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
} = authApi;
