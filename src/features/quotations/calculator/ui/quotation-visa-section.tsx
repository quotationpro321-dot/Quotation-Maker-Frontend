"use client";

import { CreditCard } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
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
  const visaTotal =
    option.visaUmrah.pax * option.visaUmrah.cost +
    option.visaEVW.pax * option.visaEVW.cost +
    option.visaHoliday.pax * option.visaHoliday.cost;

  return (
    <Card className="rounded!">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <CreditCard className="size-5 text-brand-primary" />
          Visa services
        </CardTitle>
        <span className="text-sm font-semibold text-muted-foreground">
          {formatQuotationMoney(visaTotal, currency)}
        </span>
      </CardHeader>
      <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
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
