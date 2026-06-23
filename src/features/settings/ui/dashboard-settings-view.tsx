"use client";

import { Calculator, Lock, User } from "lucide-react";

import { ReusableTabs } from "@/components/ui/reusable-tabs";

import { useDashboardSettings } from "@/features/settings/hooks/use-dashboard-settings";
import { SettingsCalculatorCatalogPanel } from "@/features/settings/ui/settings-calculator-catalog-panel";
import { SettingsLoadError } from "@/features/settings/ui/settings-load-error";
import { SettingsLoadingState } from "@/features/settings/ui/settings-loading-state";
import { SettingsPageHeader } from "@/features/settings/ui/settings-page-header";
import { SettingsPasswordPanel } from "@/features/settings/ui/settings-password-panel";
import { SettingsProfilePanel } from "@/features/settings/ui/settings-profile-panel";
import { useUser } from "@/hooks/useUser";

export function DashboardSettingsView() {
  const s = useDashboardSettings();
  const { role } = useUser();
  const isAdmin = role === "admin";

  if (s.isLoading || !s.ready) {
    return <SettingsLoadingState />;
  }

  if (s.isError || !s.profile || !s.draft) {
    return <SettingsLoadError onRetry={s.refetch} />;
  }

  return (
    <div className="space-y-6 py-6">
      <SettingsPageHeader />
      <ReusableTabs
        defaultValue="profile"
        tabs={[
          {
            value: "profile",
            label: "Profile",
            icon: <User className="size-4" aria-hidden />,
            content: (
              <SettingsProfilePanel
                draft={s.draft}
                isSaving={s.isSaving}
                onSaveIdentity={s.saveProfileIdentity}
                onFinalizeEmailChangeSession={s.finalizeEmailChangeSession}
                onAvatarUploadSuccess={s.onAvatarUploadSuccess}
              />
            ),
          },
          {
            value: "password",
            label: "Password",
            icon: <Lock className="size-4" aria-hidden />,
            content: <SettingsPasswordPanel />,
          },
          ...(isAdmin
            ? [
                {
                  value: "calculator",
                  label: "Quotation calculator",
                  icon: <Calculator className="size-4" aria-hidden />,
                  content: <SettingsCalculatorCatalogPanel />,
                },
              ]
            : []),
        ]}
      />
    </div>
  );
}
