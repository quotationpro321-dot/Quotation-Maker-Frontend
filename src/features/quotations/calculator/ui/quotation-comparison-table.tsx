"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  calculateGross,
  calculateOptionTotals,
  formatQuotationMoney,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import type { TQuotationOption } from "@/types/quotation.type";

type TQuotationComparisonTableProps = {
  options: TQuotationOption[];
  activeIndex: number;
  currency: string;
  onSelect: (index: number) => void;
};

export function QuotationComparisonTable({
  options,
  activeIndex,
  currency,
  onSelect,
}: TQuotationComparisonTableProps) {
  if (options.length <= 1) return null;

  return (
    <Card className="rounded!">
      <CardHeader>
        <CardTitle className="text-base">Options comparison</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-3 py-2">Detail</th>
              {options.map((option, index) => (
                <th key={option.id} className="px-3 py-2">
                  {option.title || `Option ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="px-3 py-2 font-medium">Makkah hotel</td>
              {options.map((option) => (
                <td key={`${option.id}-makkah`} className="px-3 py-2">
                  {option.hotelMakkah.name || "—"}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="px-3 py-2 font-medium">Final gross (adult)</td>
              {options.map((option, index) => {
                const totals = calculateOptionTotals(option);
                const gross = calculateGross(option, option.flightAdult);
                return (
                  <td key={`${option.id}-gross`} className="px-3 py-2">
                    <p className="font-bold text-brand-primary">
                      {formatQuotationMoney(gross, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Service {formatQuotationMoney(totals.serviceTotal, currency)}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant={activeIndex === index ? "default" : "outline"}
                      className="mt-2 rounded!"
                      onClick={() => onSelect(index)}
                    >
                      {activeIndex === index ? "Editing" : "Switch"}
                    </Button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
