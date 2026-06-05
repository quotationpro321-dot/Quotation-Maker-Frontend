"use client";

import { Suspense } from "react";
import { Calculator } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuotationCalculator } from "@/features/quotations/calculator/hooks/use-quotation-calculator";
import { QuotationComparisonTable } from "@/features/quotations/calculator/ui/quotation-comparison-table";
import { QuotationCustomerHeader } from "@/features/quotations/calculator/ui/quotation-customer-header";
import { QuotationFlightSection } from "@/features/quotations/calculator/ui/quotation-flight-section";
import { QuotationHotelSection } from "@/features/quotations/calculator/ui/quotation-hotel-section";
import { QuotationNotesSection } from "@/features/quotations/calculator/ui/quotation-notes-section";
import { QuotationOptionTabs } from "@/features/quotations/calculator/ui/quotation-option-tabs";
import { QuotationPreviewDialog } from "@/features/quotations/calculator/ui/quotation-preview-dialog";
import { QuotationSummaryPanel } from "@/features/quotations/calculator/ui/quotation-summary-panel";
import { QuotationTransferSection } from "@/features/quotations/calculator/ui/quotation-transfer-section";
import { QuotationVisaSection } from "@/features/quotations/calculator/ui/quotation-visa-section";
import type { TQuotationCalculatorType } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

type TQuotationCalculatorViewProps = {
  expectedRole: UserRole;
};

const CALCULATOR_TYPE_META: Record<
  TQuotationCalculatorType,
  { label: string; description: string }
> = {
  umrah: {
    label: "Umrah",
    description: "Flight, hotel, visa, and transfer pricing for Umrah quotations.",
  },
  holiday: {
    label: "Holiday",
    description: "Build holiday quotations with flights, hotel, visa, and transfer costs.",
  },
  flights: {
    label: "Flights",
    description: "Flight-only calculator focused on itinerary and fare pricing.",
  },
};

function QuotationCalculatorContent({
  expectedRole,
}: TQuotationCalculatorViewProps) {
  const {
    draft,
    activeOptions,
    activeOption,
    activeTotals,
    activeOptionIndex,
    isPreviewOpen,
    isParsingFlight,
    previewRef,
    updateDraft,
    updateActiveOption,
    setActiveOptionIndex,
    addOption,
    removeOption,
    addRoute,
    removeRoute,
    updateRoute,
    parseFlightItinerary,
    setTemplateId,
    setCalculatorType,
    saveQuotation,
    openPreview,
    closePreview,
    exportImage,
    exportPdf,
  } = useQuotationCalculator({ expectedRole });
  const calculatorMeta = CALCULATOR_TYPE_META[draft.calculatorType];
  const showHotelSection = draft.calculatorType !== "flights";
  const showVisaSection = draft.calculatorType !== "flights";
  const showTransferSection = draft.calculatorType !== "flights";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
            <Calculator className="size-7 text-brand-primary" />
            Quotation Calculator
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            {calculatorMeta.description}
          </p>
        </div>
        <div className="w-full md:w-[220px]">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Calculator type
          </p>
          <Select
            value={draft.calculatorType}
            onValueChange={(value) =>
              setCalculatorType(value as TQuotationCalculatorType)
            }
          >
            <SelectTrigger className="h-10 w-full rounded!">
              <SelectValue placeholder="Select calculator" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CALCULATOR_TYPE_META).map(([value, meta]) => (
                <SelectItem key={value} value={value}>
                  {meta.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <QuotationCustomerHeader
        customerName={draft.customerName}
        customerNumber={draft.customerNumber}
        templateId={draft.templateId}
        onCustomerNameChange={(value) => updateDraft({ customerName: value })}
        onCustomerNumberChange={(value) =>
          updateDraft({ customerNumber: value })
        }
        onTemplateChange={setTemplateId}
        onAddOption={addOption}
        onPreview={openPreview}
        onSave={saveQuotation}
      />

      <QuotationOptionTabs
        options={activeOptions}
        activeIndex={activeOptionIndex}
        onSelect={setActiveOptionIndex}
        onRemove={removeOption}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-9">
          <QuotationFlightSection
            option={activeOption}
            currency={draft.currency}
            isParsing={isParsingFlight}
            onChange={updateActiveOption}
            onParse={() => void parseFlightItinerary()}
          />
          {showHotelSection ? (
            <QuotationHotelSection
              option={activeOption}
              currency={draft.currency}
              onChange={updateActiveOption}
            />
          ) : null}
          {showVisaSection ? (
            <QuotationVisaSection
              option={activeOption}
              currency={draft.currency}
              onChange={updateActiveOption}
            />
          ) : null}
          {showTransferSection ? (
            <QuotationTransferSection
              option={activeOption}
              currency={draft.currency}
              onChange={updateActiveOption}
              onAddRoute={addRoute}
              onRemoveRoute={removeRoute}
              onUpdateRoute={updateRoute}
            />
          ) : null}
          <QuotationNotesSection
            option={activeOption}
            onChange={updateActiveOption}
          />
        </div>

        <div className="lg:col-span-3">
          <QuotationSummaryPanel
            option={activeOption}
            totals={activeTotals}
            currency={draft.currency}
            onChange={updateActiveOption}
          />
        </div>
      </div>

      <QuotationComparisonTable
        options={activeOptions}
        activeIndex={activeOptionIndex}
        currency={draft.currency}
        onSelect={setActiveOptionIndex}
      />

      <QuotationPreviewDialog
        open={isPreviewOpen}
        draft={draft}
        activeOptionIndex={activeOptionIndex}
        previewRef={previewRef}
        onOpenChange={(open) => (open ? openPreview() : closePreview())}
        onExportImage={exportImage}
        onExportPdf={exportPdf}
      />
    </div>
  );
}

export function QuotationCalculatorView(props: TQuotationCalculatorViewProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded!" />
          <Skeleton className="h-40 w-full rounded!" />
        </div>
      }
    >
      <QuotationCalculatorContent {...props} />
    </Suspense>
  );
}
