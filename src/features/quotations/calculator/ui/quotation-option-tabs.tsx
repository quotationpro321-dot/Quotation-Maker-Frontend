"use client";

import { Calculator, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TQuotationOptionTabsProps = {
  options: { id: string; title: string }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
};

export function QuotationOptionTabs({
  options,
  activeIndex,
  onSelect,
  onRemove,
}: TQuotationOptionTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <div key={option.id} className="relative">
          <Button
            type="button"
            variant={activeIndex === index ? "default" : "outline"}
            className={cn(
              "rounded! pr-9",
              activeIndex === index && "bg-brand-primary! text-white! hover:bg-brand-primary-700!",
            )}
            onClick={() => onSelect(index)}
          >
            <Calculator className="size-4" />
            {option.title || `Option ${index + 1}`}
          </Button>
          {options.length > 1 ? (
            <button
              type="button"
              className={cn(
                "absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5 transition-colors",
                activeIndex === index
                  ? "text-white/85 hover:bg-white/15 hover:text-white"
                  : "text-muted-foreground hover:text-destructive",
              )}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(index);
              }}
              aria-label={`Remove ${option.title}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
