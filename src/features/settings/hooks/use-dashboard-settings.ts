"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { signOutAndRedirectToLogin } from "@/features/auth/lib/sign-out-client";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { useSettingsDraft } from "@/features/settings/hooks/use-settings-draft";
import { syncProfileToStore } from "@/features/settings/lib/sync-profile-to-store";
import { useUser } from "@/hooks/useUser";
import { useLogoutMutation } from "@/redux/api/auth.api";
import { useGetMyProfileQuery, useUpdateMyProfileMutation } from "@/redux/api/dashboard.api";
import type { AppDispatch } from "@/redux/store";
import type { IResponse } from "@/types";
import type { IDashboardProfile } from "@/types/dashboard-profile.type";
import type { TSettingsProfileIdentityValues } from "@/validation/settings-profile.schema";

export type TSettingsProfileSavePayload = TSettingsProfileIdentityValues & {
  currentPassword?: string;
};

export function useDashboardSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useUser();
  const [logout] = useLogoutMutation();
  const { data: res, isLoading, isError, refetch } = useGetMyProfileQuery();
  const profile = res?.data;
  const { draft, setDraft, ready } = useSettingsDraft(profile);
  const [updateProfile, { isLoading: isSaving }] = useUpdateMyProfileMutation();

  const pushProfile = useCallback(
    (next: IDashboardProfile) => {
      syncProfileToStore(dispatch, next);
    },
    [dispatch],
  );

  const performPostEmailLogout = useCallback(async () => {
    await signOutAndRedirectToLogin({
      dispatch,
      navigateReplace: (href) => router.replace(href),
      user,
      performLogoutRequest: () => logout(undefined).unwrap(),
    });
  }, [dispatch, logout, router, user]);

  const saveProfileIdentity = useCallback(
    async (values: TSettingsProfileSavePayload): Promise<boolean> => {
      if (!profile) {
        throw new Error("Profile is not loaded.");
      }

      const emailChanged =
        values.email.trim().toLowerCase() !== profile.email.trim().toLowerCase();

      const body = {
        name: values.name.trim(),
        email: values.email.trim(),
        whatsappNumber: values.whatsappNumber?.trim() ?? "",
        consultantDesignation: values.consultantDesignation?.trim() ?? "",
        ...(emailChanged && values.currentPassword
          ? { currentPassword: values.currentPassword }
          : {}),
      };

      const promise = updateProfile(body).unwrap();

      void toast.promise(promise, {
        loading: "Saving profile…",
        success: (apiRes: IResponse<IDashboardProfile>) =>
          emailChanged
            ? "Email updated successfully. Redirecting to login…"
            : apiRes.message,
        error: (e) =>
          extractApiErrorMessage(e, "Could not save settings. Please try again."),
      });

      const apiRes = await promise;
      const next = apiRes.data;
      pushProfile(next);
      setDraft((prev) =>
        prev
          ? {
              ...prev,
              name: next.name,
              email: next.email,
              whatsappNumber: next.whatsappNumber ?? "",
              consultantDesignation: next.consultantDesignation ?? "",
              profilePhotoUrl: next.profilePhotoUrl ?? "",
            }
          : null,
      );

      return emailChanged;
    },
    [profile, pushProfile, setDraft, updateProfile],
  );

  const finalizeEmailChangeSession = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 1600));
    await performPostEmailLogout();
  }, [performPostEmailLogout]);

  const onAvatarUploadSuccess = useCallback(
    (next: IDashboardProfile) => {
      pushProfile(next);
      setDraft((prev) =>
        prev ? { ...prev, profilePhotoUrl: next.profilePhotoUrl ?? "" } : null,
      );
    },
    [pushProfile, setDraft],
  );

  return {
    profile,
    draft,
    ready,
    isLoading,
    isError,
    isSaving,
    refetch,
    saveProfileIdentity,
    finalizeEmailChangeSession,
    onAvatarUploadSuccess,
  };
}
