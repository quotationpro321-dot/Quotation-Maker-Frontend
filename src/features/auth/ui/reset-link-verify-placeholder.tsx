"use client";

import { Spinner } from "@/components/ui/spinner";

type TResetLinkVerifyPlaceholderProps = {
  variant?: "inline" | "suspense";
};

export function ResetLinkVerifyPlaceholder({
  variant = "inline",
}: TResetLinkVerifyPlaceholderProps) {
  const spinner = <Spinner className="size-8 text-brand-primary" />;

  if (variant === "suspense") {
    return (
      <div
        className="flex min-h-48 w-full max-w-md items-center justify-center"
        role="status"
        aria-live="polite"
      >
        {spinner}
      </div>
    );
  }

  return (
    <div
      className="flex min-h-48 w-full max-w-md flex-col items-center justify-center gap-3 py-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {spinner}
      <p className="text-sm text-muted-foreground">Verifying reset link…</p>
    </div>
  );
}
