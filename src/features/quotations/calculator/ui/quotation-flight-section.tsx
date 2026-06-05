"use client";

import { useCallback, useRef } from "react";
import { Check, Copy, Download, FileText, Info, Plane } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  copyElementHtml,
  exportElementAsImage,
  exportElementAsPdf,
} from "@/features/flight-converter/lib/export-itinerary";
import {
  EXAMPLE_BG_ITINERARY,
  EXAMPLE_QR_ITINERARY,
} from "@/features/flight-converter/lib/examples";
import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import { ItineraryPreviewTable } from "@/features/flight-converter/ui/itinerary-preview-table";
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
  const itineraryPreviewRef = useRef<HTMLDivElement>(null);
  const hasItineraryPreview = option.flightSegments.length > 0;

  const flightTotal =
    option.flightAdult +
    option.flightYouth +
    option.flightChild +
    option.flightInfant;
  const displayFlightTotal = option.flightSectionEnabled ? flightTotal : 0;

  const handleCopyItinerary = useCallback(async () => {
    if (!itineraryPreviewRef.current) return;
    try {
      await copyElementHtml(itineraryPreviewRef.current);
      toast.success("Itinerary copied to clipboard.");
    } catch {
      toast.error("Could not copy itinerary.");
    }
  }, []);

  const handleExportItineraryImage = useCallback(async () => {
    if (!itineraryPreviewRef.current) return;
    try {
      await exportElementAsImage(
        itineraryPreviewRef.current,
        "flight-itinerary.png",
      );
      toast.success("Image downloaded.");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not export image. Try again.",
      );
    }
  }, []);

  const handleExportItineraryPdf = useCallback(async () => {
    if (!itineraryPreviewRef.current) return;
    try {
      await exportElementAsPdf(
        itineraryPreviewRef.current,
        "flight-itinerary.pdf",
      );
      toast.success("PDF downloaded.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not export PDF. Try again.",
      );
    }
  }, []);

  return (
    <Card className="rounded!">
      <QuotationSectionHeader
        icon={<Plane className="size-5 text-brand-primary" />}
        title="Flight itinerary & costs"
        enabled={option.flightSectionEnabled}
        onEnabledChange={(flightSectionEnabled) =>
          onChange({ flightSectionEnabled })
        }
        priceLabel={`Total: ${formatQuotationMoney(displayFlightTotal, currency)}`}
      />
      <CardContent
        className={`space-y-4 ${quotationSectionBodyClass(option.flightSectionEnabled)}`}
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>Paste flight itinerary (Amadeus text)</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded!"
                onClick={() =>
                  onChange({
                    rawItinerary: EXAMPLE_QR_ITINERARY,
                    flightSegments: [],
                  })
                }
              >
                <Info className="size-4" />
                QR Example
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded!"
                onClick={() =>
                  onChange({
                    rawItinerary: EXAMPLE_BG_ITINERARY,
                    flightSegments: [],
                  })
                }
              >
                <Info className="size-4" />
                BG Example
              </Button>
            </div>
          </div>
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

        {hasItineraryPreview ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Itinerary preview</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded!"
                  onClick={() => void handleCopyItinerary()}
                >
                  <Copy className="size-4" />
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded!"
                  onClick={() => void handleExportItineraryImage()}
                >
                  <Download className="size-4" />
                  Save as image
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="rounded! border-transparent bg-brand-primary! font-medium text-white! shadow-sm hover:bg-brand-primary-700! hover:text-white! focus-visible:ring-brand-primary/35 disabled:hover:bg-brand-primary!"
                  onClick={() => void handleExportItineraryPdf()}
                >
                  <FileText className="size-4" />
                  Export PDF
                </Button>
              </div>
            </div>
            <div className="overflow-x-hidden rounded! border border-border bg-card p-3">
              <ItineraryPreviewTable
                ref={itineraryPreviewRef}
                segments={option.flightSegments}
                layout="quotation"
              />
            </div>
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
