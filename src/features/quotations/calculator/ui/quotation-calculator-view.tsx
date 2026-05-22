"use client";

import { Suspense } from "react";
import { Calculator } from "lucide-react";

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
import type { UserRole } from "@/types/user.type";

type TQuotationCalculatorViewProps = {
  expectedRole: UserRole;
};

function QuotationCalculatorContent({
  expectedRole,
}: TQuotationCalculatorViewProps) {
  const {
    draft,
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
    saveQuotation,
    openPreview,
    closePreview,
    exportImage,
    exportPdf,
  } = useQuotationCalculator({ expectedRole });

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
          <Calculator className="size-7 text-brand-primary" />
          Quotation Calculator
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Build multi-option Umrah and holiday quotations with live pricing.
        </p>
      </div>

      <QuotationCustomerHeader
        customerName={draft.customerName}
        customerNumber={draft.customerNumber}
        onCustomerNameChange={(value) => updateDraft({ customerName: value })}
        onCustomerNumberChange={(value) =>
          updateDraft({ customerNumber: value })
        }
        onAddOption={addOption}
        onPreview={openPreview}
        onSave={saveQuotation}
      />

      <QuotationOptionTabs
        options={draft.options}
        activeIndex={activeOptionIndex}
        onSelect={setActiveOptionIndex}
        onRemove={removeOption}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <QuotationFlightSection
            option={activeOption}
            currency={draft.currency}
            isParsing={isParsingFlight}
            onChange={updateActiveOption}
            onParse={() => void parseFlightItinerary()}
          />
          <QuotationHotelSection
            option={activeOption}
            currency={draft.currency}
            onChange={updateActiveOption}
          />
          <QuotationVisaSection
            option={activeOption}
            currency={draft.currency}
            onChange={updateActiveOption}
          />
          <QuotationTransferSection
            option={activeOption}
            onChange={updateActiveOption}
            onAddRoute={addRoute}
            onRemoveRoute={removeRoute}
            onUpdateRoute={updateRoute}
          />
          <QuotationNotesSection
            option={activeOption}
            onChange={updateActiveOption}
          />
        </div>

        <div className="lg:col-span-4">
          <QuotationSummaryPanel
            option={activeOption}
            totals={activeTotals}
            currency={draft.currency}
            onChange={updateActiveOption}
          />
        </div>
      </div>

      <QuotationComparisonTable
        options={draft.options}
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
        onTemplateChange={setTemplateId}
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
