"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

import { appToast } from "@/lib/app-toast";

import {
  useResetPasswordMutation,
  useValidateResetCodeQuery,
} from "@/redux/api/auth.api";
import type { TAuthResetPasswordValues } from "@/validation/auth-reset-password.schema";

import { AUTH_ROUTES } from "../constants";
import { extractApiErrorMessage } from "../lib/extract-api-error-message";
import { isPasswordResetTokenExpiredLikeError } from "../lib/reset-password-errors";

type TResetPasswordPhase =
  | "missing-or-expired"
  | "verifying"
  | "invalid"
  | "ready";

export function useResetPasswordFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetPasswordMutation] = useResetPasswordMutation();

  const code = useMemo(() => searchParams.get("code")?.trim() ?? "", [searchParams]);
  const hasCode = Boolean(code);

  const {
    data: validateData,
    isLoading: isValidateLoading,
    isFetching: isValidateFetching,
    isError: isValidateError,
    isSuccess: isValidateSuccess,
  } = useValidateResetCodeQuery(code, { skip: !hasCode });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forceExpiredAfterSubmit, setForceExpiredAfterSubmit] = useState(false);

  const isValidating =
    hasCode &&
    (isValidateLoading ||
      isValidateFetching ||
      (!isValidateError && !isValidateSuccess && !validateData));

  const isCodeInvalid =
    hasCode &&
    !isValidating &&
    (isValidateError ||
      (isValidateSuccess && validateData?.data?.valid !== true));

  const phase: TResetPasswordPhase = useMemo(() => {
    if (!hasCode || forceExpiredAfterSubmit) return "missing-or-expired";
    if (isValidating) return "verifying";
    if (isCodeInvalid) return "invalid";
    return "ready";
  }, [forceExpiredAfterSubmit, hasCode, isCodeInvalid, isValidating]);

  const submitPasswords = useCallback(
    async (data: TAuthResetPasswordValues): Promise<string | null> => {
      if (!code) {
        setForceExpiredAfterSubmit(true);
        return "Reset link is invalid or expired.";
      }
      setIsSubmitting(true);
      try {
        await resetPasswordMutation({
          code,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }).unwrap();
        appToast.passwordResetComplete();
        router.push(AUTH_ROUTES.login);
        return null;
      } catch (error) {
        if (isPasswordResetTokenExpiredLikeError(error)) {
          setForceExpiredAfterSubmit(true);
          return null;
        }
        return extractApiErrorMessage(
          error,
          "Could not reset password. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [code, resetPasswordMutation, router],
  );

  return {
    code,
    phase,
    loginHref: AUTH_ROUTES.login,
    isSubmitting,
    submitPasswords,
  };
}
