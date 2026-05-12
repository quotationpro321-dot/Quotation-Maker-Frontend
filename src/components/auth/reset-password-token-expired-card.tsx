import { KeyRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ResetPasswordTokenExpiredCardProps = {
  className?: string;
};

/**
 * Shown when the reset link is missing, expired (JWT exp or backend), or invalid.
 */
export function ResetPasswordTokenExpiredCard({
  className,
}: ResetPasswordTokenExpiredCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-md rounded border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
        <div className="relative flex flex-col items-center" aria-hidden>
          <div className="mb-1 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="size-1 rounded-full bg-orange-500" />
                <span className="h-2 w-px bg-orange-500/80" />
              </span>
            ))}
          </div>
          <KeyRound
            className="size-14 text-orange-500"
            strokeWidth={1.35}
            aria-hidden
          />
        </div>

        <p className="text-base font-medium text-muted-foreground">
          This token has been expired
        </p>

        <Button
          asChild
          className={cn(
            "h-11 w-full max-w-xs rounded border-0 font-semibold text-white shadow-md",
            "bg-linear-to-r from-fuchsia-600 to-violet-600",
            "hover:from-fuchsia-500 hover:to-violet-500",
            "focus-visible:ring-2 focus-visible:ring-violet-400/50",
          )}
        >
          <Link href="/auth/forgot-password">Try Again</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
