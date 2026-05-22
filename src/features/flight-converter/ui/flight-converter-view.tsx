"use client";

import { Check, Copy, Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFlightConverter } from "@/features/flight-converter/hooks/use-flight-converter";
import { FlightConverterErrorBoundary } from "@/features/flight-converter/ui/flight-converter-error-boundary";
import { ItineraryEmptyState } from "@/features/flight-converter/ui/itinerary-empty-state";
import { ItineraryErrorState } from "@/features/flight-converter/ui/itinerary-error-state";
import { ItineraryPreviewTable } from "@/features/flight-converter/ui/itinerary-preview-table";
import { PnrInputPanel } from "@/features/flight-converter/ui/pnr-input-panel";
import { SegmentEditCard } from "@/features/flight-converter/ui/segment-edit-card";

export function FlightConverterView() {
  const {
    rawText,
    setRawText,
    parseResult,
    editableSegments,
    timeFormat,
    setTimeFormat,
    validationError,
    previewRef,
    isLoading,
    handleConvert,
    handleClear,
    loadExample,
    updateSegment,
    handleCopy,
    handleExportImage,
    handleExportPdf,
    hasPreview,
  } = useFlightConverter();

  const showEmpty = !rawText.trim() && !hasPreview && !isLoading;

  return (
    <FlightConverterErrorBoundary>
      <div className="space-y-8">
        <PnrInputPanel
          rawText={rawText}
          onRawTextChange={setRawText}
          timeFormat={timeFormat}
          onTimeFormatChange={setTimeFormat}
          isLoading={isLoading}
          onConvert={() => void handleConvert()}
          onClear={handleClear}
          onLoadExample={loadExample}
        />

        <ItineraryErrorState
          errors={parseResult?.errors ?? []}
          warnings={parseResult?.warnings ?? []}
          validationError={validationError}
        />

        {showEmpty && <ItineraryEmptyState />}

        {hasPreview && (
          <section className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold">
                  Professional Itinerary Output
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded!"
                    onClick={() => void handleCopy()}
                  >
                    <Copy className="size-4" />
                    Copy
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded!"
                    onClick={() => void handleExportImage()}
                  >
                    <Download className="size-4" />
                    Save as image
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="rounded! border-transparent bg-brand-primary! font-medium text-white! shadow-sm hover:bg-brand-primary-700! hover:text-white! focus-visible:ring-brand-primary/35 disabled:hover:bg-brand-primary!"
                    onClick={() => void handleExportPdf()}
                  >
                    <FileText className="size-4" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>

            <Card className="overflow-x-auto overflow-y-visible rounded!">
              <CardContent className="p-3">
                <ItineraryPreviewTable
                  ref={previewRef}
                  segments={editableSegments}
                />
              </CardContent>
            </Card>

            <Card className="rounded!">
              <CardHeader>
                <CardTitle className="text-base">Edit segments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editableSegments.map((seg, index) => (
                  <SegmentEditCard
                    key={`edit-${seg.segmentOrder}-${index}`}
                    segment={seg}
                    index={index}
                    onChange={(patch) => updateSegment(index, patch)}
                  />
                ))}
              </CardContent>
            </Card>

            {parseResult && parseResult.meta.segmentCount > 0 && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check
                  className="size-3.5 shrink-0 text-brand-secondary"
                  aria-hidden
                />
                Parsed {parseResult.meta.segmentCount} segment(s) as{" "}
                {parseResult.format}
                {parseResult.meta.skippedLineCount > 0 &&
                  ` · ${parseResult.meta.skippedLineCount} line(s) skipped`}
              </p>
            )}
          </section>
        )}
      </div>
    </FlightConverterErrorBoundary>
  );
}
