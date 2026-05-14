"use client";

import { User } from "lucide-react";
import { useId, useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { TSettingsProfileSavePayload } from "@/features/settings/hooks/use-dashboard-settings";
import type { TSettingsDraft } from "@/features/settings/hooks/use-settings-draft";
import { useProfileAvatarUpload } from "@/features/settings/hooks/use-profile-avatar-upload";
import { initialsFromName } from "@/features/settings/lib/settings-profile-helpers";
import { SettingsProfileAvatarSection } from "@/features/settings/ui/settings-profile-avatar-section";
import { SettingsProfileIdentityForm } from "@/features/settings/ui/settings-profile-identity-form";
import type { IDashboardProfile } from "@/types/dashboard-profile.type";

type TSettingsProfilePanelProps = {
  draft: TSettingsDraft;
  isSaving: boolean;
  onSaveIdentity: (values: TSettingsProfileSavePayload) => Promise<boolean>;
  onFinalizeEmailChangeSession: () => Promise<void>;
  onAvatarUploadSuccess: (profile: IDashboardProfile) => void;
};

export function SettingsProfilePanel({
  draft,
  isSaving,
  onSaveIdentity,
  onFinalizeEmailChangeSession,
  onAvatarUploadSuccess,
}: TSettingsProfilePanelProps) {
  const avatarInputId = useId();
  const initials = useMemo(() => initialsFromName(draft.name), [draft.name]);
  const avatar = useProfileAvatarUpload(onAvatarUploadSuccess);

  return (
    <Card className="min-w-0 max-w-full border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-brand-primary">
          <User className="size-5" aria-hidden />
          Profile Information
        </CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SettingsProfileAvatarSection
          photoUrl={draft.profilePhotoUrl}
          initials={initials}
          inputId={avatarInputId}
          inputRef={avatar.inputRef}
          isUploading={avatar.isLoading}
          error={avatar.error}
          onPickClick={avatar.openPicker}
          onFileChange={avatar.onFileChange}
        />
        <SettingsProfileIdentityForm
          userId={draft.userId}
          defaultName={draft.name}
          defaultEmail={draft.email}
          isSaving={isSaving}
          onSubmit={onSaveIdentity}
          onFinalizeEmailChangeSession={onFinalizeEmailChangeSession}
        />
      </CardContent>
    </Card>
  );
}
