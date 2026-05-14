import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a password reset link for your ALSAMA dashboard account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-3">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Forgot <span className="text-brand-secondary">password</span>
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          No worries, we&apos;ll send reset instructions to your email.
        </p>
      </div>

      <div className="mt-10 w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
