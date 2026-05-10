import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type InputFieldProps = React.ComponentProps<"input"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    { id, label, hint, error, leading, trailing, className, ...props },
    ref,
  ) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy =
      [hintId, errorId].filter(Boolean).join(" ") || undefined;

    if (leading) {
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <div
            className={cn(
              "flex h-12 w-full overflow-hidden rounded-xs border border-brand-primary/40 bg-background",
              "transition-[border-color,box-shadow] duration-(--motion-fast)",
              "hover:border-brand-primary/65",
              "focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/35",
              error &&
                "border-destructive focus-within:border-destructive focus-within:ring-destructive/30",
              className,
            )}
          >
            <div
              className="flex h-full w-10 shrink-0 items-center justify-center bg-brand-primary text-white [&_svg]:pointer-events-none [&_svg]:size-4"
              aria-hidden
            >
              {leading}
            </div>
            <div className="relative min-w-0 flex-1 bg-brand-primary/10 dark:bg-muted/40">
              <Input
                ref={ref}
                id={id}
                aria-invalid={Boolean(error) || undefined}
                aria-describedby={describedBy}
                className={cn(
                  "h-12 w-full rounded-none border-0 bg-transparent px-3 shadow-none",
                  "placeholder:text-placeholder",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  trailing && "pr-12",
                )}
                {...props}
              />
              {trailing ? (
                <div className="absolute inset-y-0 right-2 z-10 flex items-center">
                  {trailing}
                </div>
              ) : null}
            </div>
          </div>
          {hint && !error ? (
            <p id={hintId} className="text-xs text-muted-foreground/80">
              {hint}
            </p>
          ) : null}
          {error ? (
            <p
              id={errorId}
              role="alert"
              className="text-xs font-medium text-destructive"
            >
              {error}
            </p>
          ) : null}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={describedBy}
            className={cn(trailing && "pr-12", className)}
            {...props}
          />
          {trailing ? (
            <div className="absolute inset-y-0 right-2 flex items-center">
              {trailing}
            </div>
          ) : null}
        </div>
        {hint && !error ? (
          <p id={hintId} className="text-xs text-muted-foreground/80">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p
            id={errorId}
            role="alert"
            className="text-xs font-medium text-destructive"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

export { InputField };
