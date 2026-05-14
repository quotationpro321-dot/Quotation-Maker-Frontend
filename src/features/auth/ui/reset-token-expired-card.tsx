import { KeyRound } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { AUTH_ROUTES } from "../constants";

type TResetTokenExpiredCardProps = {
  className?: string;
};

export function ResetTokenExpiredCard({
  className,
}: TResetTokenExpiredCardProps) {
  return (
    <Card
      className={cn(
        "w-full max-w-md rounded border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center gap-6 px-6 py-10 text-center sm:px-10">
        <div className="relative flex flex-col items-center p-5" aria-hidden>
          <div className="mb-1 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="flex flex-col items-center gap-0.5">
                <span className="size-1 rounded-full bg-brand-secondary" />
                <span className="h-2 w-px bg-brand-secondary/70" />
              </span>
            ))}
          </div>
          <KeyRound
            className="size-14 text-brand-primary"
            strokeWidth={1.35}
            aria-hidden
          />
        </div>

        <p className="text-base font-medium text-foreground">
          This token has been{" "}
          <span className="text-brand-secondary">expired</span>
        </p>

        <Button
          asChild
          className={cn(
            "h-11 w-full max-w-xs rounded border-0 font-semibold text-white shadow-md",
            "bg-linear-to-r from-brand-primary to-brand-primary-800",
            "hover:from-brand-primary-600 hover:to-brand-primary-900",
            "focus-visible:ring-2 focus-visible:ring-brand-secondary/45",
          )}
        >
          <Link href={AUTH_ROUTES.forgotPassword}>Try Again</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
