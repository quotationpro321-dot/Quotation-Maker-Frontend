"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { persistCachedProfile } from "@/lib/auth-profile-storage";
import { useLoginMutation } from "@/redux/api/auth.api";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import type { IResponse } from "@/types";
import type { ILoginResponseData } from "@/types/auth-login-response.type";
import type { TAuthLoginValues } from "@/validation/auth-login.schema";

import { extractApiErrorMessage } from "../lib/extract-api-error-message";
import {
  getDashboardPathByRole,
  normalizeUserRoleForDashboard,
} from "../lib/dashboard-role";

export function useDashboardLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const runLogin = useCallback(
    async (
      data: TAuthLoginValues,
    ): Promise<{ ok: true } | { ok: false; message: string }> => {
      setIsPending(true);
      try {
        const response = (await loginMutation({
          email: data.email.trim(),
          password: data.password,
        }).unwrap()) as IResponse<ILoginResponseData>;

        const u = response?.data?.user;
        const userId = u?._id ?? u?.id;
        if (!userId) {
          return { ok: false, message: "Login response did not include a user id." };
        }

        const role = response?.data?.role ?? u?.role;
        const normalizedRole = normalizeUserRoleForDashboard(role);
        const displayName = u?.name?.trim();
        const photo = u?.profilePhotoUrl?.trim();
        const accountCode =
          typeof u?.userId === "string" ? u.userId : undefined;

        dispatch(
          setUser({
            _id: userId,
            email: u?.email ?? data.email.trim(),
            role: normalizedRole,
            ...(displayName ? { name: displayName } : {}),
            ...(photo ? { photo } : {}),
            ...(accountCode ? { accountCode } : {}),
          }),
        );

        persistCachedProfile(userId, {
          name: displayName,
          photo,
        });
        if (accountCode && accountCode !== userId) {
          persistCachedProfile(accountCode, {
            name: displayName,
            photo,
          });
        }
        router.push(getDashboardPathByRole(role));
        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          message: extractApiErrorMessage(
            error,
            "Could not sign you in. Please try again.",
          ),
        };
      } finally {
        setIsPending(false);
      }
    },
    [dispatch, loginMutation, router],
  );

  return {
    runLogin,
    isPending,
    showPassword,
    togglePasswordVisibility,
  };
}
