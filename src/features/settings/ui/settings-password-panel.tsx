"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Save } from "lucide-react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { BrandInputShell } from "@/components/ui/input-field";
import { cn } from "@/lib/utils";

import { authPrimaryButtonClassName } from "@/features/auth/constants";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { PasswordVisibilityToggle } from "@/features/auth/ui/password-visibility-toggle";
import { useChangeMyPasswordMutation } from "@/redux/api/dashboard.api";
import {
  settingsChangePasswordSchema,
  type TSettingsChangePasswordValues,
} from "@/validation/settings-password.schema";

export function SettingsPasswordPanel() {
  const formId = useId();
  const [changePassword, { isLoading }] = useChangeMyPasswordMutation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<TSettingsChangePasswordValues>({
    resolver: zodResolver(
      settingsChangePasswordSchema as never,
    ) as Resolver<TSettingsChangePasswordValues>,
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: TSettingsChangePasswordValues) {
    const promise = changePassword(data).unwrap();

    void toast.promise(promise, {
      loading: "Updating password…",
      success: {
        message: "Password updated",
        description:
          "Use your new password the next time you sign in on another device.",
      },
      error: (e) =>
        extractApiErrorMessage(e, "Could not update password. Please try again."),
    });

    try {
      await promise;
      form.reset();
    } catch (e) {
      form.setError("confirmPassword", {
        message: extractApiErrorMessage(e, "Could not update password."),
      });
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-brand-primary">
          <Lock className="size-5" aria-hidden />
          Change Password
        </CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id={formId} className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="currentPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-current`}>Current Password</FieldLabel>
                    <BrandInputShell
                      {...field}
                      id={`${formId}-current`}
                      leading={<Lock />}
                      type={showCurrent ? "text" : "password"}
                      autoComplete="current-password"
                      invalid={fieldState.invalid}
                      placeholder="Enter current password"
                      trailing={
                        <PasswordVisibilityToggle
                          visible={showCurrent}
                          onToggle={() => setShowCurrent((v) => !v)}
                          labelVisible="Hide current password"
                          labelHidden="Show current password"
                        />
                      }
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-new`}>New Password</FieldLabel>
                    <BrandInputShell
                      {...field}
                      id={`${formId}-new`}
                      leading={<Lock />}
                      type={showNew ? "text" : "password"}
                      autoComplete="new-password"
                      invalid={fieldState.invalid}
                      placeholder="Enter new password"
                      trailing={
                        <PasswordVisibilityToggle
                          visible={showNew}
                          onToggle={() => setShowNew((v) => !v)}
                          labelVisible="Hide new password"
                          labelHidden="Show new password"
                        />
                      }
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${formId}-confirm`}>Confirm New Password</FieldLabel>
                    <BrandInputShell
                      {...field}
                      id={`${formId}-confirm`}
                      leading={<Lock />}
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      invalid={fieldState.invalid}
                      placeholder="Confirm new password"
                      trailing={
                        <PasswordVisibilityToggle
                          visible={showConfirm}
                          onToggle={() => setShowConfirm((v) => !v)}
                          labelVisible="Hide confirm password"
                          labelHidden="Show confirm password"
                        />
                      }
                    />
                    {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                form={formId}
                disabled={isLoading}
                className={cn("gap-2 rounded-xs", authPrimaryButtonClassName)}
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Save className="size-4" aria-hidden />
                )}
                Change Password
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              New password must be at least 8 characters and include uppercase, number, and special
              character.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
