"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { BrandInputShell } from "@/components/ui/input-field";
import { authPrimaryButtonClassName } from "@/features/auth/constants";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { PasswordVisibilityToggle } from "@/features/auth/ui/password-visibility-toggle";
import { cn } from "@/lib/utils";
import {
  settingsEmailChangeConfirmSchema,
  type TSettingsEmailChangeConfirmValues,
} from "@/validation/settings-email-change-confirm.schema";

type TConfirmEmailChangeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextEmail: string;
  isSubmitting: boolean;
  onConfirm: (password: string) => Promise<void>;
};

export function ConfirmEmailChangeDialog({
  open,
  onOpenChange,
  nextEmail,
  isSubmitting,
  onConfirm,
}: TConfirmEmailChangeDialogProps) {
  const formId = useId();
  const descriptionId = `${formId}-desc`;
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<TSettingsEmailChangeConfirmValues>({
    resolver: zodResolver(
      settingsEmailChangeConfirmSchema as never,
    ) as Resolver<TSettingsEmailChangeConfirmValues>,
    defaultValues: { currentPassword: "" },
  });
  const { reset } = form;

  useEffect(() => {
    if (!open) {
      reset({ currentPassword: "" });
      void Promise.resolve().then(() => {
        setShowPassword(false);
      });
    }
  }, [open, reset]);

  const handleOpenChange = (next: boolean) => {
    if (!next && isSubmitting) return;
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[calc(100%-2rem)] gap-0 overflow-hidden p-0 sm:max-w-104",
          "border-border/80 shadow-lg",
        )}
        showCloseButton={!isSubmitting}
        onPointerDownOutside={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isSubmitting) e.preventDefault();
        }}
      >
        <Form {...form}>
          <form
            id={formId}
            className="flex flex-col"
            onSubmit={form.handleSubmit(async (data) => {
              try {
                await onConfirm(data.currentPassword);
              } catch (err) {
                form.setError("currentPassword", {
                  message: extractApiErrorMessage(
                    err,
                    "Could not verify password. Please try again.",
                  ),
                });
              }
            })}
          >
            <div className="space-y-5 px-5 pt-5 pb-6 sm:px-6">
              <DialogHeader className="space-y-0">
                <div className="text-center">
                  <span
                    className="mx-auto mb-3 grid size-10 place-items-center rounded-lg bg-brand-secondary/15 text-brand-secondary ring-1 ring-brand-secondary/25"
                    aria-hidden
                  >
                    <AlertTriangle className="size-4.5" strokeWidth={2.25} />
                  </span>
                  <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">
                    Confirm email change
                  </DialogTitle>
                  <DialogDescription
                    id={descriptionId}
                    className="mx-auto mt-1.5 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground"
                  >
                    Changing your email will log you out on this device. You will need to sign in
                    again with your new email.
                  </DialogDescription>
                </div>

                <div
                  role="status"
                  className="mt-4 rounded-lg border border-brand-primary/20 bg-brand-primary/[0.07] px-3.5 py-2.5 text-center text-sm dark:bg-brand-primary/15"
                >
                  <span className="text-muted-foreground">Signing in after update as </span>
                  <span className="font-medium text-brand-primary">{nextEmail}</span>
                </div>
              </DialogHeader>

              <FieldGroup className="gap-2">
                <Controller
                  name="currentPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-pwd`} className="text-foreground">
                        Current password
                      </FieldLabel>
                      <BrandInputShell
                        {...field}
                        id={`${formId}-pwd`}
                        leading={<Lock />}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        invalid={fieldState.invalid}
                        disabled={isSubmitting}
                        placeholder="Enter your current password"
                        trailing={
                          <PasswordVisibilityToggle
                            visible={showPassword}
                            onToggle={() => setShowPassword((v) => !v)}
                            labelVisible="Hide password"
                            labelHidden="Show password"
                          />
                        }
                      />
                      {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                    </Field>
                  )}
                />
              </FieldGroup>

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleOpenChange(false)}
                  className="h-10 w-full rounded-xs sm:w-auto sm:min-w-26"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "h-10 w-full gap-2 rounded-xs sm:w-auto sm:min-w-42",
                    authPrimaryButtonClassName,
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                      Saving…
                    </>
                  ) : (
                    "Confirm & save"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
