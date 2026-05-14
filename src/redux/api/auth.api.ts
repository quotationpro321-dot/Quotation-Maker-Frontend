import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";
import type { ILoginResponseData } from "@/types/auth-login-response.type";
import { ILogin } from "@/types/auth.type";

const AUTH_URL = "/auth";

/**
 * Backend sets `accessToken` + `refreshToken` as httpOnly cookies (`setAuthCookie`).
 * The client must never store or attach those tokens — only `withCredentials` so
 * cookies flow on API calls. Use `user` (and role) from the JSON body for UI state.
 */
interface IForgotPasswordPayload {
  email: string;
}

interface IResetPasswordPayload {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

type TValidateResetCodeResponse = IResponse<{ valid: boolean }>;

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
    /** GET — read-only; does not consume the reset token. Used on reset-password page load. */
    validateResetCode: builder.query<TValidateResetCodeResponse, string>({
      query: (code) => ({
        url: `${AUTH_URL}/validate-reset-code`,
        method: "GET",
        params: { code },
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useValidateResetCodeQuery,
} = authApi;
