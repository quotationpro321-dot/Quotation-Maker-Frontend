"use client";

import type { ChangeEvent } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { validateAvatarFile } from "@/features/settings/lib/validate-avatar-file";
import { useUploadAdminUserAvatarMutation } from "@/redux/api/users.api";
import type { TAdminUser } from "@/types/admin-user.type";

type TUseAdminUserAvatarOptions = {
  /** Set when editing an existing user; omit on create until the user is saved. */
  userId: string | null;
  initialPhotoUrl?: string | null;
  disabled?: boolean;
};

export function useAdminUserAvatar({
  userId,
  initialPhotoUrl,
  disabled = false,
}: TUseAdminUserAvatarOptions) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl ?? "");
  const [error, setError] = useState<string>();
  const [upload, { isLoading }] = useUploadAdminUserAvatarMutation();

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pendingFileRef.current = null;
    revokePreview();
    setPhotoUrl(initialPhotoUrl ?? "");
    setError(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }, [initialPhotoUrl, revokePreview]);

  useEffect(() => {
    reset();
  }, [userId, initialPhotoUrl, reset]);

  useEffect(() => () => revokePreview(), [revokePreview]);

  const openPicker = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      setError(undefined);
      if (!file || disabled) return;

      const validation = validateAvatarFile(file);
      if (validation) {
        setError(validation);
        return;
      }

      if (userId) {
        try {
          const promise = upload({ id: userId, file }).unwrap();
          void toast.promise(promise, {
            loading: "Uploading photo…",
            success: "Profile photo updated",
            error: (err) =>
              extractApiErrorMessage(err, "Could not upload image. Please try again."),
          });
          const out = await promise;
          revokePreview();
          pendingFileRef.current = null;
          setPhotoUrl(out.data.profilePhotoUrl ?? "");
        } catch (err) {
          setError(extractApiErrorMessage(err, "Could not upload image."));
        }
        return;
      }

      pendingFileRef.current = file;
      revokePreview();
      previewUrlRef.current = URL.createObjectURL(file);
      setPhotoUrl(previewUrlRef.current);
    },
    [disabled, revokePreview, upload, userId],
  );

  const uploadPendingForUser = useCallback(
    async (newUserId: string): Promise<TAdminUser | null> => {
      const file = pendingFileRef.current;
      if (!file) return null;

      try {
        const out = await upload({ id: newUserId, file }).unwrap();
        pendingFileRef.current = null;
        revokePreview();
        setPhotoUrl(out.data.profilePhotoUrl ?? "");
        return out.data;
      } catch (err) {
        setError(extractApiErrorMessage(err, "Could not upload image."));
        throw err;
      }
    },
    [revokePreview, upload],
  );

  const hasPendingFile = () => Boolean(pendingFileRef.current);

  return {
    inputId,
    inputRef,
    photoUrl,
    error,
    isLoading,
    openPicker,
    onFileChange,
    uploadPendingForUser,
    hasPendingFile,
    reset,
  };
}
