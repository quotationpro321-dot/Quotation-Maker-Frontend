import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const brandInputShellClasses =
  "relative flex h-12 w-full min-w-0 max-w-full overflow-hidden rounded-xs border border-brand-primary/40 bg-background transition-[border-color,box-shadow] duration-(--motion-fast) hover:border-brand-primary/65 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-inset focus-within:ring-brand-primary/35";

const brandInputShellInvalidClasses =
  "border-destructive hover:border-destructive/90 focus-within:border-destructive focus-within:ring-destructive/30";

type BrandInputShellProps = Omit<React.ComponentProps<"input">, "className"> & {
  id: string;
  leading: React.ReactNode;
  trailing?: React.ReactNode;
  invalid?: boolean;
  className?: string;
  inputClassName?: string;
};

/**
 * Login-style control: leading brand strip, tinted field body, optional trailing slot (e.g. password eye).
 * Use with {@link Field} + {@link FieldLabel} + {@link FieldError}, or standalone with {@link InputField}.
 */
const BrandInputShell = React.forwardRef<HTMLInputElement, BrandInputShellProps>(
  function BrandInputShell(
    { id, leading, trailing, invalid, className, inputClassName, ...inputProps },
    ref,
  ) {
    return (
      <div
        className={cn(
          brandInputShellClasses,
          invalid && brandInputShellInvalidClasses,
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
            aria-invalid={invalid || undefined}
            className={cn(
              "h-12 w-full rounded-none border-0 bg-transparent px-3 shadow-none",
              "placeholder:text-muted-foreground/80",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              trailing && "pr-12",
              inputClassName,
            )}
            {...inputProps}
          />
          {trailing ? (
            <div className="absolute inset-y-0 right-2 z-10 flex items-center">{trailing}</div>
          ) : null}
        </div>
      </div>
    );
  },
);

BrandInputShell.displayName = "BrandInputShell";

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
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    if (leading) {
      return (
        <div className="space-y-2">
          <Label htmlFor={id}>{label}</Label>
          <BrandInputShell
            ref={ref}
            id={id}
            leading={leading}
            trailing={trailing}
            invalid={Boolean(error)}
            className={className}
            aria-describedby={describedBy}
            {...props}
          />
          {hint && !error ? (
            <p id={hintId} className="text-xs text-muted-foreground/80">
              {hint}
            </p>
          ) : null}
          {error ? (
            <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
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
            <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
          ) : null}
        </div>
        {hint && !error ? (
          <p id={hintId} className="text-xs text-muted-foreground/80">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

InputField.displayName = "InputField";

export { BrandInputShell, InputField };
