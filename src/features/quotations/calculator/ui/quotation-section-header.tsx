"use client";

import type { ReactNode } from "react";

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type TQuotationSectionHeaderProps = {
  icon: ReactNode;
  title: string;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  priceLabel?: string;
  trailing?: ReactNode;
};

export function QuotationSectionHeader({
  icon,
  title,
  enabled,
  onEnabledChange,
  priceLabel,
  trailing,
}: TQuotationSectionHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between gap-3 border-b">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          aria-label={`${enabled ? "Disable" : "Enable"} ${title}`}
        />
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </div>
      {trailing ? (
        <div
          className={cn(
            "shrink-0",
            !enabled && "pointer-events-none opacity-50",
          )}
        >
          {trailing}
        </div>
      ) : priceLabel ? (
        <span
          className={cn(
            "shrink-0 rounded! bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary",
            !enabled && "opacity-50",
          )}
        >
          {priceLabel}
        </span>
      ) : null}
    </CardHeader>
  );
}

export function quotationSectionBodyClass(enabled: boolean): string {
  return cn("pt-6", !enabled && "pointer-events-none opacity-50");
}
