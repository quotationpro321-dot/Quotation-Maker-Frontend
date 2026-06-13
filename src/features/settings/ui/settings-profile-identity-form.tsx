"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Loader2, Mail, MessageCircle, Save, UserRound } from "lucide-react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { BrandInputShell } from "@/components/ui/input-field";
import { authPrimaryButtonClassName } from "@/features/auth/constants";
import type { TSettingsProfileSavePayload } from "@/features/settings/hooks/use-dashboard-settings";
import { ConfirmEmailChangeDialog } from "@/features/settings/ui/confirm-email-change-dialog";
import { cn } from "@/lib/utils";
import {
  settingsProfileIdentitySchema,
  type TSettingsProfileIdentityValues,
} from "@/validation/settings-profile.schema";

type TSettingsProfileIdentityFormProps = {
  userId: string;
  defaultName: string;
  defaultEmail: string;
  defaultWhatsapp: string;
  isSaving: boolean;
  onSubmit: (values: TSettingsProfileSavePayload) => Promise<boolean>;
  onFinalizeEmailChangeSession: () => Promise<void>;
};

export function SettingsProfileIdentityForm({
  userId,
  defaultName,
  defaultEmail,
  defaultWhatsapp,
  isSaving,
  onSubmit,
  onFinalizeEmailChangeSession,
}: TSettingsProfileIdentityFormProps) {
  const formId = useId();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [pendingIdentity, setPendingIdentity] = useState<TSettingsProfileIdentityValues | null>(
    null,
  );

  const form = useForm<TSettingsProfileIdentityValues>({
    resolver: zodResolver(
      settingsProfileIdentitySchema as never,
    ) as Resolver<TSettingsProfileIdentityValues>,
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      whatsappNumber: defaultWhatsapp,
    },
    values: {
      name: defaultName,
      email: defaultEmail,
      whatsappNumber: defaultWhatsapp,
    },
  });

  const emailChangedVsServer = (data: TSettingsProfileIdentityValues) =>
    data.email.trim().toLowerCase() !== defaultEmail.trim().toLowerCase();

  const handleEmailDialogConfirm = async (currentPassword: string) => {
    if (!pendingIdentity) return;
    const emailChanged = await onSubmit({ ...pendingIdentity, currentPassword });
    setEmailDialogOpen(false);
    setPendingIdentity(null);
    if (emailChanged) {
      await onFinalizeEmailChangeSession();
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          id={formId}
          className="space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            if (emailChangedVsServer(data)) {
              setPendingIdentity(data);
              setEmailDialogOpen(true);
              return;
            }
            try {
              await onSubmit(data);
            } catch {
              /* errors surfaced via Sonner in useDashboardSettings */
            }
          })}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${formId}-user-id`}>User ID</FieldLabel>
              <BrandInputShell
                id={`${formId}-user-id`}
                name="user-id-display"
                leading={<Hash />}
                value={userId}
                readOnly
                disabled
              />
              <FieldDescription>User ID cannot be changed.</FieldDescription>
            </Field>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-name`}>Full Name</FieldLabel>
                    <BrandInputShell
                      {...field}
                      id={`${formId}-name`}
                      leading={<UserRound />}
                      autoComplete="name"
                      invalid={fieldState.invalid}
                      placeholder="Your full name"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-email`}>Email Address</FieldLabel>
                    <BrandInputShell
                      {...field}
                      id={`${formId}-email`}
                      leading={<Mail />}
                      type="email"
                      autoComplete="email"
                      invalid={fieldState.invalid}
                      placeholder="you@company.com"
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="whatsappNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-whatsapp`}>
                    WhatsApp Number
                  </FieldLabel>
                  <BrandInputShell
                    {...field}
                    value={field.value ?? ""}
                    id={`${formId}-whatsapp`}
                    leading={<MessageCircle />}
                    type="tel"
                    autoComplete="tel"
                    invalid={fieldState.invalid}
                    placeholder="e.g. +44 7960 046798"
                  />
                  <FieldDescription>
                    Shown on your quotation PDFs. Leave blank to hide it.
                  </FieldDescription>
                  {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              form={formId}
              disabled={isSaving}
              className={cn("gap-2 rounded-xs", authPrimaryButtonClassName)}
            >
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Save className="size-4" aria-hidden />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmEmailChangeDialog
        open={emailDialogOpen}
        onOpenChange={(open) => {
          setEmailDialogOpen(open);
          if (!open) setPendingIdentity(null);
        }}
        nextEmail={pendingIdentity?.email.trim() ?? ""}
        isSubmitting={isSaving}
        onConfirm={handleEmailDialogConfirm}
      />
    </>
  );
}
