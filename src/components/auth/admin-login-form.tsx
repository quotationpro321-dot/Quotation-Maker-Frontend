"use client";

import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { FaKaaba } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-field";
import { persistCachedProfile } from "@/lib/auth-profile-storage";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/api/auth.api";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { IResponse } from "@/types";
import { UserRole } from "@/types/user.type";

type AdminLoginFormProps = {
  className?: string;
};

/** Tokens live in httpOnly cookies from the backend — not in this shape for client use. */
type LoginResponseData = {
  role?: string;
  user?: {
    _id?: string;
    id?: string;
    email?: string;
    role?: string;
    name?: string;
    profilePhotoUrl?: string;
  } | null;
};

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
  return "Could not sign you in. Please try again.";
};

const getDashboardPathByRole = (role?: string): string => {
  const normalizedRole = role?.trim().toLowerCase();
  if (normalizedRole === "employee") return "/dashboard/employee";
  return "/dashboard/admin";
};

const getNormalizedRole = (role?: string): UserRole => {
  return role?.trim().toLowerCase() === "employee" ? "employee" : "admin";
};

export function AdminLoginForm({ className }: AdminLoginFormProps) {
  const formId = useId();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: typeof errors = {};

    if (!email.trim()) {
      nextErrors.email = "Enter your work email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Use a valid work email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsPending(true);
    try {
      const response = (await login({
        email: email.trim(),
        password,
      }).unwrap()) as IResponse<LoginResponseData>;

      const u = response?.data?.user;
      const userId = u?._id ?? u?.id;
      if (!userId) {
        setErrors({ password: "Login response did not include a user id." });
        return;
      }

      const role = response?.data?.role ?? u?.role;
      const normalizedRole = getNormalizedRole(role);
      const displayName = u?.name?.trim();
      const photo = u?.profilePhotoUrl?.trim();

      dispatch(
        setUser({
          _id: userId,
          email: u?.email ?? email.trim(),
          role: normalizedRole,
          ...(displayName ? { name: displayName } : {}),
          ...(photo ? { photo } : {}),
        }),
      );

      persistCachedProfile(userId, {
        name: displayName,
        photo,
      });

      router.push(getDashboardPathByRole(role));
    } catch (error) {
      setErrors({ password: getErrorMessage(error) });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn(
        "w-full max-w-md space-y-6",
        "animate-in fade-in-50 slide-in-from-bottom-2 duration-500",
        className,
      )}
      noValidate
    >
      <InputField
        id={`${formId}-email`}
        name="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        placeholder="admin@alsama.co.uk"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        error={errors.email}
        required
        autoFocus
        leading={<Mail className="size-4" aria-hidden />}
      />

      <InputField
        id={`${formId}-password`}
        name="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Enter your password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        error={errors.password}
        required
        leading={<Lock className="size-4" aria-hidden />}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors duration-(--motion-instant) hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        }
      />

      <div className="-mt-3 flex justify-end">
        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-brand-secondary underline-offset-4 transition-colors duration-(--motion-instant) hover:text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary/40"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className={cn(
          "h-12 w-full rounded-xs bg-[#204F54] text-white",
          "transition-colors duration-(--motion-instant)",
          "hover:bg-[#1b4347]",
          "focus-visible:ring-2 focus-visible:ring-[#204F54]/55",
        )}
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
        <span className="inline-flex items-center justify-center">
          <FaKaaba className="size-5 text-brand-secondary" />
        </span>
        <span className="h-px flex-1 bg-brand-secondary/75" />
      </div>

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-brand-secondary" aria-hidden />
        Secured with{" "}
        <span className="font-medium text-brand-secondary">
          enterprise-grade protection
        </span>
      </p>
    </form>
  );
}
