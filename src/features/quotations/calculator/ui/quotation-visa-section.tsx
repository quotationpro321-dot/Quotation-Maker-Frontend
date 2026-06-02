"use client";

import { CreditCard } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateVisaTotal,
  formatQuotationMoney,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import type { TQuotationOption, TQuotationVisaLine } from "@/types/quotation.type";

type TQuotationVisaSectionProps = {
  option: TQuotationOption;
  currency: string;
  onChange: (patch: Partial<TQuotationOption>) => void;
};

const VISA_FIELDS = [
  { label: "Umrah visa", field: "visaUmrah" },
  { label: "EVW visa", field: "visaEVW" },
  { label: "Holiday visa", field: "visaHoliday" },
] as const;

export function QuotationVisaSection({
  option,
  currency,
  onChange,
}: TQuotationVisaSectionProps) {
  const visaTotal = calculateVisaTotal(option);
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
        className={`grid gap-4 md:grid-cols-3 ${quotationSectionBodyClass(option.visaSectionEnabled)}`}
      >
        {VISA_FIELDS.map(({ label, field }) => {
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
