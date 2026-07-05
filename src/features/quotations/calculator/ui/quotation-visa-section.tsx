"use client";

import { CreditCard } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateVisaTotal,
  formatQuotationMoney,
  getVisaFieldsForCalculatorType,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import type {
  TQuotationCalculatorType,
  TQuotationOption,
  TQuotationVisaLine,
} from "@/types/quotation.type";
import { cn } from "@/lib/utils";

type TQuotationVisaSectionProps = {
  calculatorType: TQuotationCalculatorType;
  option: TQuotationOption;
  currency: string;
  onChange: (patch: Partial<TQuotationOption>) => void;
};

const visaGridClassByCount: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export function QuotationVisaSection({
  calculatorType,
  option,
  currency,
  onChange,
}: TQuotationVisaSectionProps) {
  const visaFields = getVisaFieldsForCalculatorType(calculatorType);
  const visaTotal = calculateVisaTotal(option, calculatorType);
  const displayVisaTotal = option.visaSectionEnabled ? visaTotal : 0;

  return (
    <Card className="rounded!">
      <QuotationSectionHeader
        icon={<CreditCard className="size-5 text-brand-primary" />}
        title="Visa services"
        enabled={option.visaSectionEnabled}
        onEnabledChange={(visaSectionEnabled) => onChange({ visaSectionEnabled })}
        priceLabel={formatQuotationMoney(displayVisaTotal, currency)}
      />
      <CardContent
        className={cn(
          "grid gap-4",
          visaGridClassByCount[visaFields.length] ?? "md:grid-cols-1",
          quotationSectionBodyClass(option.visaSectionEnabled),
        )}
      >
        {visaFields.map(({ label, field }) => {
          const visa = option[field] as TQuotationVisaLine;
          return (
            <div key={field} className="space-y-3 rounded! border border-border p-3">
              <p className="text-sm font-semibold">{label}</p>
              <div className="space-y-2">
                <Label>Pax</Label>
                <Input
                  type="number"
                  min={0}
                  value={visa.pax || ""}
                  onChange={(e) =>
                    onChange({
                      [field]: {
                        ...visa,
                        pax: Number.parseInt(e.target.value, 10) || 0,
                      },
                    })
                  }
                  className="rounded!"
                />
              </div>
              <div className="space-y-2">
                <Label>Cost</Label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={visa.cost || ""}
                  onChange={(e) =>
                    onChange({
                      [field]: {
                        ...visa,
                        cost: Number.parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                  className="rounded!"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Subtotal: {formatQuotationMoney(visa.pax * visa.cost, currency)}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
