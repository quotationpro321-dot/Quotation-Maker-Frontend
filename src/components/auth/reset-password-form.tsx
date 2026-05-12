"use client";

import { Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";

import { ResetPasswordTokenExpiredCard } from "@/components/auth/reset-password-token-expired-card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { useResetPasswordMutation } from "@/redux/api/auth.api";
import {
  isPasswordResetTokenExpiredLikeError,
  shouldShowResetTokenExpiredImmediately,
} from "@/utils/reset-password-token.utils";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const errorObj = error as {
      data?: { message?: string } | string;
      message?: string;
    };
    if (typeof errorObj.data === "string") return errorObj.data;
    if (errorObj.data && typeof errorObj.data.message === "string") {
      return errorObj.data.message;
    }
    if (typeof errorObj.message === "string") return errorObj.message;
  }
  return "Could not reset password. Please try again.";
};

export function ResetPasswordForm() {
  const formId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resetPassword] = useResetPasswordMutation();

  const code = searchParams.get("code")?.trim() ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();
  const [showExpiredUi, setShowExpiredUi] = useState(() =>
    shouldShowResetTokenExpiredImmediately(code),
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!code) {
      setShowExpiredUi(true);
      return;
    }
    if (!newPassword) {
      setError("Enter your new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (confirmPassword !== newPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(undefined);
    setIsPending(true);
    try {
      await resetPassword({
        code,
        newPassword,
        confirmPassword,
      }).unwrap();
      router.push("/auth/login");
    } catch (apiError) {
      if (isPasswordResetTokenExpiredLikeError(apiError)) {
        setShowExpiredUi(true);
        return;
      }
      setError(getErrorMessage(apiError));
    } finally {
      setIsPending(false);
    }
  }

  if (showExpiredUi) {
    return (
      <div className="flex w-full flex-col items-center justify-center py-4">
        <ResetPasswordTokenExpiredCard />
      </div>
    );
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

      <form
        onSubmit={handleSubmit}
        className="mt-10 w-full max-w-md space-y-5"
        noValidate
      >
      <InputField
        id={`${formId}-new-password`}
        name="newPassword"
        label="New Password"
        type={showNewPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.currentTarget.value)}
        required
        leading={<Lock className="size-4" aria-hidden />}
        trailing={
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors duration-(--motion-instant) hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40"
          >
            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />

      <InputField
        id={`${formId}-confirm-password`}
        name="confirmPassword"
        label="Confirm New Password"
        type={showConfirmPassword ? "text" : "password"}
        autoComplete="new-password"
        placeholder="Enter confirm password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
        error={error}
        required
        leading={<Lock className="size-4" aria-hidden />}
        trailing={
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors duration-(--motion-instant) hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40"
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <Button asChild className="h-11 rounded-xs bg-[#204F54] text-white hover:bg-[#1b4347]">
          <Link href="/auth/login">Back</Link>
        </Button>
        <Button type="submit" disabled={isPending || !code} className="h-11 rounded-xs bg-[#204F54] text-white hover:bg-[#1b4347]">
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </Button>
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-brand-secondary" aria-hidden />
        Password update is protected and secure.
      </p>
    </form>
    </>
  );
}
