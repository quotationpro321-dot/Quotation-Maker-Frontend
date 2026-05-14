"use client";

import type { ChangeEvent } from "react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { validateAvatarFile } from "@/features/settings/lib/validate-avatar-file";
import { useUploadMyProfileAvatarMutation } from "@/redux/api/dashboard.api";
import type { IDashboardProfile } from "@/types/dashboard-profile.type";

export function useProfileAvatarUpload(
  onSuccess: (profile: IDashboardProfile) => void,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>();
  const [upload, { isLoading }] = useUploadMyProfileAvatarMutation();

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      setError(undefined);
      if (!file) return;

      const validation = validateAvatarFile(file);
      if (validation) {
        setError(validation);
        return;
      }

      try {
        const promise = upload(file).unwrap();

        void toast.promise(promise, {
          loading: "Uploading photo…",
          success: {
            message: "Profile photo updated",
            description: "Your new picture appears in the header and account settings.",
          },
          error: (err) =>
            extractApiErrorMessage(err, "Could not upload image. Please try again."),
        });

        const out = await promise;
        onSuccess(out.data);
      } catch (err) {
        setError(extractApiErrorMessage(err, "Could not upload image."));
      }
    },
    [onSuccess, upload],
  );

  return { inputRef, error, isLoading, openPicker, onFileChange };
}
