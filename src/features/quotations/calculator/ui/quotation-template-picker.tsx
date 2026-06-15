"use client";

import { listQuotationTemplatesForCalculatorType } from "@/features/quotations/calculator/lib/quotation-template-registry";
import { cn } from "@/lib/utils";
import type {
  TQuotationCalculatorType,
  TQuotationTemplateId,
} from "@/types/quotation.type";

type TQuotationTemplatePickerProps = {
  calculatorType: TQuotationCalculatorType;
  selectedTemplateId: TQuotationTemplateId;
  onSelect: (templateId: TQuotationTemplateId) => void;
};

export function QuotationTemplatePicker({
  calculatorType,
  selectedTemplateId,
  onSelect,
}: TQuotationTemplatePickerProps) {
  const templates = listQuotationTemplatesForCalculatorType(calculatorType);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {templates.map((template) => {
        const isSelected = template.id === selectedTemplateId;
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              "rounded! border p-4 text-left transition-colors",
              isSelected
                ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/30"
                : "border-border hover:border-brand-primary/40",
            )}
          >
            <p className="font-semibold">{template.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {template.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
