"use client";

import { Receipt } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  calculateGross,
  formatQuotationMoney,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import type { TOptionTotals } from "@/features/quotations/calculator/lib/calculate-quotation";
import type { TQuotationOption } from "@/types/quotation.type";

type TQuotationSummaryPanelProps = {
  option: TQuotationOption;
  totals: TOptionTotals;
  currency: string;
  onChange: (patch: Partial<TQuotationOption>) => void;
};

export function QuotationSummaryPanel({
  option,
  totals,
  currency,
  onChange,
}: TQuotationSummaryPanelProps) {
  const rows = [
    { label: "Adult gross", cost: option.flightAdult },
    { label: "Youth gross", cost: option.flightYouth },
    { label: "Child gross", cost: option.flightChild },
    { label: "Infant gross", cost: option.flightInfant },
  ];

  return (
    <Card className="sticky top-24 rounded! border-border bg-card shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Receipt className="size-5 text-brand-primary" />
          Live calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Number of pax</Label>
            <Input
              type="number"
              min={1}
              value={option.numPax || ""}
              onChange={(e) =>
                onChange({ numPax: Number.parseInt(e.target.value, 10) || 1 })
              }
              className="rounded!"
            />
          </div>
          <div className="space-y-2">
            <Label>Markup / person</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={option.markupPerPerson || ""}
              onChange={(e) =>
                onChange({
                  markupPerPerson: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="rounded!"
            />
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service total</span>
            <span>{formatQuotationMoney(totals.serviceTotal, currency)}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Per person service</span>
            <span>
              {formatQuotationMoney(totals.perPersonServiceCost, currency)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {row.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Flight + service + markup
                </p>
              </div>
              <p className="text-lg font-bold text-brand-primary">
                {formatQuotationMoney(calculateGross(option, row.cost), currency)}
              </p>
            </div>
          ))}
        </div>

        <p className="rounded! bg-muted/40 p-3 text-xs text-muted-foreground">
          Total markup across all pax:{" "}
          <span className="font-semibold text-foreground">
            {formatQuotationMoney(totals.totalMarkup, currency)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
