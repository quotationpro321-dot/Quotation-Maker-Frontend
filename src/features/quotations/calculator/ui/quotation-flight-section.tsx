"use client";

import { Check, Plane } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
import type { TQuotationOption } from "@/types/quotation.type";

type TQuotationFlightSectionProps = {
  option: TQuotationOption;
  currency: string;
  isParsing: boolean;
  onChange: (patch: Partial<TQuotationOption>) => void;
  onParse: () => void;
};

export function QuotationFlightSection({
  option,
  currency,
  isParsing,
  onChange,
  onParse,
}: TQuotationFlightSectionProps) {
  const flightTotal =
    option.flightAdult +
    option.flightYouth +
    option.flightChild +
    option.flightInfant;

  return (
    <Card className="rounded!">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plane className="size-5 text-brand-primary" />
          Flight itinerary & costs
        </CardTitle>
        <span className="rounded! bg-brand-primary/10 px-3 py-1 text-sm font-semibold text-brand-primary">
          Total: {formatQuotationMoney(flightTotal, currency)}
        </span>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label>Paste flight itinerary (Amadeus text)</Label>
          <Textarea
            value={option.rawItinerary}
            onChange={(e) => onChange({ rawItinerary: e.target.value })}
            placeholder="1  QR 104 K 19MAY 2*LHRDOH DK1  0825 1700..."
            className="min-h-32 rounded! font-mono text-xs"
          />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded!"
              disabled={isParsing || !option.rawItinerary.trim()}
              onClick={() => void onParse()}
            >
              {isParsing ? "Parsing…" : "Parse itinerary"}
            </Button>
            {option.flightSegments.length > 0 ? (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                <Check className="size-3.5" />
                {option.flightSegments.length} segments parsed
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Hold luggage</Label>
            <Input
              value={option.holdLuggage}
              onChange={(e) => onChange({ holdLuggage: e.target.value })}
              placeholder="e.g. 25kg checked bag"
              className="rounded!"
            />
          </div>
          <div className="space-y-2">
            <Label>Cabin luggage</Label>
            <Input
              value={option.cabinLuggage}
              onChange={(e) => onChange({ cabinLuggage: e.target.value })}
              placeholder="e.g. 7kg cabin bag"
              className="rounded!"
            />
          </div>
        </div>

        {option.flightSegments.length > 0 ? (
          <div className="overflow-x-auto rounded! border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2">Flight</th>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Route</th>
                  <th className="px-3 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {option.flightSegments.map((seg) => (
                  <tr key={`${seg.segmentOrder}-${seg.flightNumber}`} className="border-t">
                    <td className="px-3 py-2 font-semibold">{seg.flightNumber}</td>
                    <td className="px-3 py-2">{seg.departureDateDisplay}</td>
                    <td className="px-3 py-2">
                      {seg.fromCode} → {seg.toCode}
                    </td>
                    <td className="px-3 py-2">
                      {seg.departureTime} – {seg.arrivalTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["Adult price", "flightAdult"],
              ["Youth price", "flightYouth"],
              ["Child price", "flightChild"],
              ["Infant price", "flightInfant"],
            ] as const
          ).map(([label, field]) => (
            <div key={field} className="space-y-2">
              <Label>{label}</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={option[field] || ""}
                onChange={(e) =>
                  onChange({ [field]: Number.parseFloat(e.target.value) || 0 })
                }
                className="rounded!"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
