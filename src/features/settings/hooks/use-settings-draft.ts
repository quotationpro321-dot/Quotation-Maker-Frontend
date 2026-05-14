"use client";

import { startTransition, useEffect, useState } from "react";

import type { IDashboardProfile } from "@/types/dashboard-profile.type";

import { profileToFormState } from "@/features/settings/lib/settings-profile-helpers";

export type TSettingsDraft = {
  userId: string;
  name: string;
  email: string;
  profilePhotoUrl: string;
};

export function useSettingsDraft(profile: IDashboardProfile | undefined) {
  const [draft, setDraft] = useState<TSettingsDraft | null>(null);

  useEffect(() => {
    if (!profile) return;
    const f = profileToFormState(profile);
    startTransition(() => {
      setDraft({
        userId: profile.userId,
        ...f,
        profilePhotoUrl: f.profilePhotoUrl ?? "",
      });
    });
  }, [profile]);

  return { draft, setDraft, ready: draft !== null };
}
