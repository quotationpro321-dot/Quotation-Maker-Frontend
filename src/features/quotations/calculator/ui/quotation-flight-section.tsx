"use client";

import { useCallback, useRef, useState, type ChangeEvent } from "react";
import {
  Check,
  Clock,
  Copy,
  Download,
  FileText,
  ImageIcon,
  Info,
  Plane,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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
  compressFlightItineraryImage,
  FLIGHT_ITINERARY_IMAGE_ACCEPT,
  getFlightItineraryImage,
  getFlightItineraryMode,
  hasFlightItineraryContent,
} from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import { QuotationFlightItineraryImagePreview } from "@/features/quotations/calculator/ui/quotation-flight-itinerary-image-preview";
import { ItineraryPreviewTable } from "@/features/flight-converter/ui/itinerary-preview-table";
import type {
  TFlightItineraryInputMode,
  TQuotationOption,
} from "@/types/quotation.type";
import { cn } from "@/lib/utils";
import { runWithLoadingFeedback } from "@/lib/run-with-loading-feedback";

type TQuotationFlightSectionProps = {
  option: TQuotationOption;
  currency: string;
  isParsing: boolean;
  onChange: (patch: Partial<TQuotationOption>) => void;
  onParse: () => void;
};

function ItineraryModeToggle({
  mode,
  onChange,
}: {
  mode: TFlightItineraryInputMode;
  onChange: (mode: TFlightItineraryInputMode) => void;
}) {
  return (
    <div className="inline-flex rounded! border border-border p-0.5">
      {(
        [
          { value: "text" as const, label: "Text", icon: Type },
          { value: "image" as const, label: "Image", icon: ImageIcon },
        ] as const
      ).map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          variant={mode === value ? "default" : "ghost"}
          size="sm"
          className={cn(
            "rounded! gap-1.5",
            mode === value &&
              "bg-brand-primary! text-white! hover:bg-brand-primary-700!",
          )}
          onClick={() => onChange(value)}
        >
          <Icon className="size-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}

export function QuotationFlightSection({
  option,
  currency,
  isParsing,
  onChange,
  onParse,
}: TQuotationFlightSectionProps) {
  const itineraryPreviewRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [isExportingItineraryPdf, setIsExportingItineraryPdf] = useState(false);
  const isExportingItineraryPdfRef = useRef(false);
  const itineraryMode = getFlightItineraryMode(option);
  const itineraryImage = getFlightItineraryImage(option);
  const isImageMode = itineraryMode === "image";
  const hasItineraryPreview = hasFlightItineraryContent(option);

  const flightTotal =
    option.flightAdult +
    option.flightYouth +
    option.flightChild +
    option.flightInfant;
  const displayFlightTotal = option.flightSectionEnabled ? flightTotal : 0;

  const handleItineraryModeChange = useCallback(
    (mode: TFlightItineraryInputMode) => {
      if (mode === itineraryMode) return;

      if (mode === "image") {
        onChange({
          flightItineraryMode: "image",
          flightItineraryImage: "",
          rawItinerary: "",
          flightSegments: [],
        });
        return;
      }

      onChange({
        flightItineraryMode: "text",
        flightItineraryImage: "",
      });
    },
    [itineraryMode, onChange],
  );

  const handleImageFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setIsUploadingImage(true);
      try {
        const dataUrl = await compressFlightItineraryImage(file);
        onChange({
          flightItineraryMode: "image",
          flightItineraryImage: dataUrl,
          rawItinerary: "",
          flightSegments: [],
        });
        toast.success("Flight itinerary image added.");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Could not upload image.",
        );
      } finally {
        setIsUploadingImage(false);
      }
    },
    [onChange],
  );

  const handleRemoveImage = useCallback(() => {
    onChange({ flightItineraryImage: "" });
  }, [onChange]);

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
    const element = itineraryPreviewRef.current;
    if (!element) return;

    await runWithLoadingFeedback({
      guardRef: isExportingItineraryPdfRef,
      setLoading: setIsExportingItineraryPdf,
      loadingMessage: "Preparing your PDF…",
      successMessage: "PDF downloaded.",
      errorMessage: "Could not export PDF. Try again.",
      run: () => exportElementAsPdf(element, "flight-itinerary.pdf"),
    });
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
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>Flight itinerary source</Label>
            <ItineraryModeToggle
              mode={itineraryMode}
              onChange={handleItineraryModeChange}
            />
          </div>

          {isImageMode ? (
            <div className="space-y-3">
              <Input
                ref={imageInputRef}
                type="file"
                accept={FLIGHT_ITINERARY_IMAGE_ACCEPT}
                className="sr-only"
                onChange={(event) => void handleImageFileChange(event)}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded!"
                  disabled={isUploadingImage}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  {isUploadingImage ? "Uploading…" : "Upload itinerary image"}
                </Button>
                {itineraryImage ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded! text-destructive hover:text-destructive"
                    onClick={handleRemoveImage}
                  >
                    <Trash2 className="size-4" />
                    Remove image
                  </Button>
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload a screenshot or photo of the itinerary. No parsing — the
                image appears as-is in preview and PDF. JPEG, PNG, WebP, or GIF
                up to 5 MB.
              </p>
            </div>
          ) : (
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
          )}
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
              {!isImageMode ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={showDuration ? "default" : "outline"}
                    size="sm"
                    className="rounded!"
                    aria-pressed={showDuration}
                    onClick={() => setShowDuration((current) => !current)}
                  >
                    <Clock className="size-4" />
                    Duration {showDuration ? "On" : "Off"}
                  </Button>
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
                    className={cn(
                      "min-w-32 rounded! border-transparent bg-brand-primary! font-medium text-white! shadow-sm hover:bg-brand-primary-700! hover:text-white! focus-visible:ring-brand-primary/35 disabled:cursor-not-allowed disabled:hover:bg-brand-primary!",
                      isExportingItineraryPdf && "disabled:opacity-100",
                    )}
                    onClick={() => void handleExportItineraryPdf()}
                    disabled={isExportingItineraryPdf}
                    aria-busy={isExportingItineraryPdf}
                    aria-disabled={isExportingItineraryPdf}
                  >
                    {isExportingItineraryPdf ? (
                      <>
                        <Spinner className="text-white" />
                        Exporting…
                      </>
                    ) : (
                      <>
                        <FileText className="size-4" />
                        Export PDF
                      </>
                    )}
                  </Button>
                </div>
              ) : null}
            </div>
            <div className="overflow-x-hidden rounded! border border-border bg-card p-3">
              {isImageMode && itineraryImage ? (
                <div ref={itineraryPreviewRef}>
                  <QuotationFlightItineraryImagePreview src={itineraryImage} />
                </div>
              ) : (
                <ItineraryPreviewTable
                  ref={itineraryPreviewRef}
                  segments={option.flightSegments}
                  layout="quotation"
                  showDuration={showDuration}
                />
              )}
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
