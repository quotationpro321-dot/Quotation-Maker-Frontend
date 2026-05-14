"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaKaaba } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { BrandInputShell } from "@/components/ui/input-field";
import { appToast } from "@/lib/app-toast";
import { cn } from "@/lib/utils";
import { authLoginSchema, type TAuthLoginValues } from "@/validation/auth-login.schema";

import { AUTH_ROUTES, authPrimaryButtonClassName } from "../constants";
import { useDashboardLogin } from "../hooks/use-dashboard-login";
import { AuthFormFooterNote } from "./auth-form-footer-note";
import { PasswordVisibilityToggle } from "./password-visibility-toggle";

type TDashboardLoginFormProps = {
  className?: string;
};

export function DashboardLoginForm({ className }: TDashboardLoginFormProps) {
  const formId = useId();
  const { runLogin, isPending, showPassword, togglePasswordVisibility } = useDashboardLogin();

  const form = useForm<TAuthLoginValues>({
    resolver: zodResolver(authLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: TAuthLoginValues) {
    const result = await runLogin(values);
    if (!result.ok) {
      form.setError("password", { message: result.message });
      appToast.loginFailed(result.message);
    }
  }

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "w-full max-w-md space-y-6",
          "animate-in fade-in-50 slide-in-from-bottom-2 duration-500",
          className,
        )}
        noValidate
      >
        <FieldGroup>
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
                  placeholder="admin@alsama.co.uk"
                  invalid={fieldState.invalid}
                />
                {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`${formId}-password`}>Password</FieldLabel>
                <BrandInputShell
                  {...field}
                  id={`${formId}-password`}
                  leading={<Lock />}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  invalid={fieldState.invalid}
                  trailing={
                    <PasswordVisibilityToggle
                      visible={showPassword}
                      onToggle={togglePasswordVisibility}
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

        <div className="-mt-3 flex justify-end">
          <Link
            href={AUTH_ROUTES.forgotPassword}
            className="text-xs font-medium text-brand-secondary underline-offset-4 transition-colors duration-(--motion-instant) hover:text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          form={formId}
          disabled={isPending}
          className={cn("h-12 w-full rounded-xs", authPrimaryButtonClassName)}
        >
          <span className="inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-wide">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              "Login"
            )}
          </span>
        </Button>

        <div className="flex items-center gap-3" aria-hidden>
          <span className="h-px flex-1 bg-brand-secondary/75" />
          <FaKaaba className="size-5 text-brand-secondary" />
          <span className="h-px flex-1 bg-brand-secondary/75" />
        </div>

        <AuthFormFooterNote>
          Secured with{" "}
          <span className="font-medium text-brand-secondary">enterprise-grade protection</span>
        </AuthFormFooterNote>
      </form>
    </Form>
  );
}
