"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
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
  authForgotPasswordSchema,
  type TAuthForgotPasswordValues,
} from "@/validation/auth-forgot-password.schema";

import { authPrimaryButtonClassName } from "../constants";
import { useForgotPasswordFlow } from "../hooks/use-forgot-password-flow";
import { AuthFormFooterNote } from "./auth-form-footer-note";
import { ForgotPasswordEmailSentDialog } from "./forgot-password-email-sent-dialog";

type TForgotPasswordFormProps = {
  defaultEmail?: string;
};

export function ForgotPasswordForm({ defaultEmail }: TForgotPasswordFormProps) {
  const formId = useId();
  const flow = useForgotPasswordFlow();

  const form = useForm<TAuthForgotPasswordValues>({
    resolver: zodResolver(authForgotPasswordSchema),
    defaultValues: { email: defaultEmail ?? "" },
    values: { email: defaultEmail ?? "" },
  });

  async function onSubmit(data: TAuthForgotPasswordValues) {
    const err = await flow.sendResetEmail(data.email.trim());
    if (err) {
      form.setError("email", { message: err });
      toast.error("Could not send reset link", {
        description: err,
        duration: 5200,
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          id={formId}
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-5"
          noValidate
        >
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${formId}-email`}>Email</FieldLabel>
                  <BrandInputShell
                    {...field}
                    id={`${formId}-email`}
                    leading={<Mail />}
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    invalid={fieldState.invalid}
                    autoFocus
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
              disabled={flow.isPending}
              className={cn("h-11 rounded-xs", authPrimaryButtonClassName)}
            >
              {flow.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Sending...
                </span>
              ) : (
                "Next"
              )}
            </Button>
          </div>

          <AuthFormFooterNote>Reset instructions are sent securely.</AuthFormFooterNote>
        </form>
      </Form>

      <ForgotPasswordEmailSentDialog
        open={flow.successOpen}
        onOpenChange={flow.setSuccessOpen}
        emailDisplay={flow.sentToEmail || form.getValues("email").trim()}
      />
    </>
  );
}
