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
  PlusCircle,
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
import { ItineraryPreviewTable } from "@/features/flight-converter/ui/itinerary-preview-table";
import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  calculateFlightFamiliesTotal,
  createEmptyFlightFamily,
  getDefaultFlightFamilyTitle,
  getFlightFamilyHeading,
  getFlightFamilyMode,
  hasFlightFamilyItineraryContent,
  MAX_FLIGHT_FAMILIES,
  MIN_FLIGHT_FAMILIES,
  resolveFlightFamilies,
  syncOptionFromFlightFamilies,
  updateFlightFamilyInList,
  type TFlightFamilyPriceField,
} from "@/features/quotations/calculator/lib/quotation-flight-families";
import {
  compressFlightItineraryImage,
  FLIGHT_ITINERARY_IMAGE_ACCEPT,
} from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import { QuotationFlightItineraryImagePreview } from "@/features/quotations/calculator/ui/quotation-flight-itinerary-image-preview";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
import { runWithLoadingFeedback } from "@/lib/run-with-loading-feedback";
import { cn } from "@/lib/utils";
import type {
  TFlightItineraryInputMode,
  TQuotationFlightFamily,
  TQuotationOption,
} from "@/types/quotation.type";

type TQuotationFlightSectionProps = {
  option: TQuotationOption;
  currency: string;
  isParsing: boolean;
  onChange: (patch: Partial<TQuotationOption>) => void;
  onParse: (familyId: string) => void;
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

type TFlightFamilyBlockProps = {
  family: TQuotationFlightFamily;
  index: number;
  disabled: boolean;
  canRemove: boolean;
  isParsing: boolean;
  onFamilyChange: (patch: Partial<TQuotationFlightFamily>) => void;
  onRemove: () => void;
  onParse: () => void;
};

function FlightFamilyBlock({
  family,
  index,
  disabled,
  canRemove,
  isParsing,
  onFamilyChange,
  onRemove,
  onParse,
}: TFlightFamilyBlockProps) {
  const itineraryPreviewRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showDuration, setShowDuration] = useState(false);
  const [isExportingItineraryPdf, setIsExportingItineraryPdf] = useState(false);
  const isExportingItineraryPdfRef = useRef(false);

  const itineraryMode = getFlightFamilyMode(family);
  const isImageMode = itineraryMode === "image";
  const hasItineraryPreview = hasFlightFamilyItineraryContent(family);

  const handleItineraryModeChange = useCallback(
    (mode: TFlightItineraryInputMode) => {
      if (mode === itineraryMode) return;

      if (mode === "image") {
        onFamilyChange({
          flightItineraryMode: "image",
          flightItineraryImage: "",
          rawItinerary: "",
          flightSegments: [],
        });
        return;
      }

      onFamilyChange({
        flightItineraryMode: "text",
        flightItineraryImage: "",
      });
    },
    [itineraryMode, onFamilyChange],
  );

  const handleImageFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      setIsUploadingImage(true);
      try {
        const dataUrl = await compressFlightItineraryImage(file);
        onFamilyChange({
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
    [onFamilyChange],
  );

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

  const priceFields: Array<[string, TFlightFamilyPriceField]> = [
    ["Adult price", "flightAdult"],
    ["Youth price", "flightYouth"],
    ["Child price", "flightChild"],
    ["Infant price", "flightInfant"],
  ];

  return (
    <div className="space-y-4 rounded! border border-border p-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          value={family.title}
          onChange={(e) => onFamilyChange({ title: e.target.value })}
          placeholder={getDefaultFlightFamilyTitle(index)}
          disabled={disabled}
          className="h-9 max-w-[220px] rounded! border-transparent bg-transparent px-2 text-sm font-semibold shadow-none focus-visible:border-input focus-visible:bg-background"
          aria-label={`Family ${index + 1} name`}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded!"
          disabled={disabled || !canRemove}
          onClick={onRemove}
          aria-label={`Remove ${getFlightFamilyHeading(family, index)}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

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
                disabled={disabled || isUploadingImage}
                onClick={() => imageInputRef.current?.click()}
              >
                <Upload className="size-4" />
                {isUploadingImage ? "Uploading…" : "Upload itinerary image"}
              </Button>
              {family.flightItineraryImage ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded! text-destructive hover:text-destructive"
                  disabled={disabled}
                  onClick={() => onFamilyChange({ flightItineraryImage: "" })}
                >
                  <Trash2 className="size-4" />
                  Remove image
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload a screenshot or photo of the itinerary. No parsing — the
              image appears as-is in preview and PDF. JPEG, PNG, WebP, or GIF up
              to 5 MB.
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
                  disabled={disabled}
                  onClick={() =>
                    onFamilyChange({
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
                  disabled={disabled}
                  onClick={() =>
                    onFamilyChange({
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
              value={family.rawItinerary}
              onChange={(e) => onFamilyChange({ rawItinerary: e.target.value })}
              placeholder="1  QR 104 K 19MAY 2*LHRDOH DK1  0825 1700..."
              disabled={disabled}
              className="min-h-32 rounded! font-mono text-xs"
            />
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded!"
                disabled={disabled || isParsing || !family.rawItinerary.trim()}
                onClick={() => void onParse()}
              >
                {isParsing ? "Parsing…" : "Parse itinerary"}
              </Button>
              {family.flightSegments.length > 0 ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <Check className="size-3.5" />
                  {family.flightSegments.length} segments parsed
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
            value={family.holdLuggage}
            onChange={(e) => onFamilyChange({ holdLuggage: e.target.value })}
            placeholder="e.g. 25kg checked bag"
            disabled={disabled}
            className="rounded!"
          />
        </div>
        <div className="space-y-2">
          <Label>Cabin luggage</Label>
          <Input
            value={family.cabinLuggage}
            onChange={(e) => onFamilyChange({ cabinLuggage: e.target.value })}
            placeholder="e.g. 7kg cabin bag"
            disabled={disabled}
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
            {isImageMode && family.flightItineraryImage ? (
              <div ref={itineraryPreviewRef}>
                <QuotationFlightItineraryImagePreview
                  src={family.flightItineraryImage}
                />
              </div>
            ) : (
              <ItineraryPreviewTable
                ref={itineraryPreviewRef}
                segments={family.flightSegments}
                layout="quotation"
                showDuration={showDuration}
              />
            )}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {priceFields.map(([label, field]) => (
          <div key={field} className="space-y-2">
            <Label>{label}</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={family[field] || ""}
              disabled={disabled}
              onChange={(e) =>
                onFamilyChange({
                  [field]: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="rounded!"
            />
          </div>
        ))}
      </div>
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
  const sectionDisabled = !option.flightSectionEnabled;
  const families = resolveFlightFamilies(option);
  const canAddFamily = families.length < MAX_FLIGHT_FAMILIES;
  const canRemoveFamily = families.length > MIN_FLIGHT_FAMILIES;
  const flightTotal = calculateFlightFamiliesTotal(families);
  const displayFlightTotal = option.flightSectionEnabled ? flightTotal : 0;

  const commitFamilies = (nextFamilies: TQuotationFlightFamily[]) => {
    onChange(syncOptionFromFlightFamilies(nextFamilies));
  };

  const handleFamilyChange = (
    familyId: string,
    patch: Partial<TQuotationFlightFamily>,
  ) => {
    commitFamilies(updateFlightFamilyInList(families, familyId, patch));
  };

  const handleAddFamily = () => {
    if (!canAddFamily) return;
    commitFamilies([...families, createEmptyFlightFamily(families.length)]);
  };

  const handleRemoveFamily = (familyId: string) => {
    if (!canRemoveFamily) return;
    commitFamilies(families.filter((family) => family.id !== familyId));
  };

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
        className={`space-y-6 ${quotationSectionBodyClass(option.flightSectionEnabled)}`}
      >
        {families.map((family, index) => (
          <FlightFamilyBlock
            key={family.id}
            family={family}
            index={index}
            disabled={sectionDisabled}
            canRemove={canRemoveFamily}
            isParsing={isParsing}
            onFamilyChange={(patch) => handleFamilyChange(family.id, patch)}
            onRemove={() => handleRemoveFamily(family.id)}
            onParse={() => onParse(family.id)}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full rounded! border-dashed"
          disabled={sectionDisabled || !canAddFamily}
          onClick={handleAddFamily}
        >
          <PlusCircle className="size-4" />
          Add Family
        </Button>
      </CardContent>
    </Card>
  );
}
