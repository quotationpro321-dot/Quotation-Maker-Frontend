"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { BrandInputShell } from "@/components/ui/input-field";
import { cn } from "@/lib/utils";
import {
  authResetPasswordSchema,
  type TAuthResetPasswordValues,
} from "@/validation/auth-reset-password.schema";

import { authPrimaryButtonClassName } from "../constants";
import { useResetPasswordFlow } from "../hooks/use-reset-password-flow";
import { AuthFormFooterNote } from "./auth-form-footer-note";
import { PasswordVisibilityToggle } from "./password-visibility-toggle";
import { ResetLinkVerifyPlaceholder } from "./reset-link-verify-placeholder";
import { ResetTokenExpiredCard } from "./reset-token-expired-card";

export function ResetPasswordForm() {
  const formId = useId();
  const flow = useResetPasswordFlow();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<TAuthResetPasswordValues>({
    resolver: zodResolver(authResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  if (flow.phase === "verifying") {
    return <ResetLinkVerifyPlaceholder variant="inline" />;
  }

  if (flow.phase !== "ready") {
    return (
      <div className="flex w-full flex-col items-center justify-center py-4">
        <ResetTokenExpiredCard />
      </div>
    );
  }

  async function onSubmit(data: TAuthResetPasswordValues) {
    const err = await flow.submitPasswords(data);
    if (err) {
      form.setError("confirmPassword", { message: err });
      toast.error("Password not reset", {
        description: err,
        duration: 5200,
      });
    }
  }

  return (
    <>
      <div className="w-full max-w-md space-y-3">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Reset <span className="text-brand-secondary">password</span>
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Create a strong new password for your dashboard account.
        </p>
      </div>

      <Form {...form}>
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 w-full max-w-md space-y-5"
          noValidate
        >
          <FieldGroup>
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
                    placeholder="Enter new password"
                    invalid={fieldState.invalid}
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
                    placeholder="Enter confirm password"
                    invalid={fieldState.invalid}
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

          <div className="grid grid-cols-2 gap-3">
            <Button asChild className={cn("h-11 rounded-xs", authPrimaryButtonClassName)}>
              <Link href={flow.loginHref}>Back</Link>
            </Button>
            <Button
              type="submit"
              form={formId}
              disabled={flow.isSubmitting || !flow.code}
              className={cn("h-11 rounded-xs", authPrimaryButtonClassName)}
            >
              {flow.isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>

          <AuthFormFooterNote>Password update is protected and secure.</AuthFormFooterNote>
        </form>
      </Form>
    </>
  );
}
