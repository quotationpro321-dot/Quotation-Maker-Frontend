"use client";

import { useCallback, useState } from "react";

import { useForgotPasswordMutation } from "@/redux/api/auth.api";

import { AUTH_ROUTES } from "../constants";
import { extractApiErrorMessage } from "../lib/extract-api-error-message";

export function useForgotPasswordFlow() {
  const [forgotPassword] = useForgotPasswordMutation();
  const [isPending, setIsPending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const sendResetEmail = useCallback(
    async (emailTrimmed: string): Promise<string | null> => {
      setIsPending(true);
      try {
        await forgotPassword({ email: emailTrimmed }).unwrap();
        setSentToEmail(emailTrimmed);
        setSuccessOpen(true);
        return null;
      } catch (error) {
        return extractApiErrorMessage(
          error,
          "Could not send reset link. Please try again.",
        );
      } finally {
        setIsPending(false);
      }
    },
    [forgotPassword],
  );

  return {
    sendResetEmail,
    isPending,
    successOpen,
    setSuccessOpen,
    sentToEmail,
    loginHref: AUTH_ROUTES.login,
  };
}
