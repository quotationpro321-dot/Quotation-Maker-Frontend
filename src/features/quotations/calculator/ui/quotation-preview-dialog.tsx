"use client";

import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculateOptionTotals } from "@/features/quotations/calculator/lib/calculate-quotation";
import { getCalculatorTypeState } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import { getQuotationTemplate } from "@/features/quotations/calculator/lib/quotation-template-registry";
import { QuotationPagedPreviewScaler } from "@/features/quotations/calculator/ui/quotation-paged-preview-scaler";
import type { TQuotationDraft } from "@/types/quotation.type";

type TQuotationPreviewDialogProps = {
  open: boolean;
  draft: TQuotationDraft;
  activeOptionIndex: number;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onOpenChange: (open: boolean) => void;
  onExportImage: () => void;
  onExportPdf: () => void;
};

function isUmrahClassicPagedPreview(draft: TQuotationDraft): boolean {
  return draft.calculatorType === "umrah" && draft.templateId === "classic";
}

export function QuotationPreviewDialog({
  open,
  draft,
  activeOptionIndex,
  previewRef,
  onOpenChange,
  onExportImage,
  onExportPdf,
}: TQuotationPreviewDialogProps) {
  const activeCalculatorOptions = getCalculatorTypeState(draft).options;
  const activeOption =
    activeCalculatorOptions[activeOptionIndex] ?? activeCalculatorOptions[0];
  const template = getQuotationTemplate(draft.templateId);
  const TemplateComponent = template?.component;
  const totals = calculateOptionTotals(activeOption);
  const usePagedPreview = isUmrahClassicPagedPreview(draft);

  const templatePreview = TemplateComponent ? (
    <TemplateComponent
      draft={draft}
      option={activeOption}
      optionIndex={activeOptionIndex}
      totals={totals}
      currency={draft.currency}
    />
  ) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[min(100vw-2rem,64rem)]! max-w-none! flex-col gap-4 overflow-hidden rounded! p-4 sm:max-w-none!">
        <DialogHeader>
          <DialogTitle>Quotation preview</DialogTitle>
          <DialogDescription>
            Review filled data, then download as image or PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
          <div
            ref={previewRef}
            className={
              usePagedPreview
                ? "flex min-w-0 justify-center py-2"
                : "rounded! border border-border bg-muted/20 p-4"
            }
          >
            {usePagedPreview ? (
              <QuotationPagedPreviewScaler>{templatePreview}</QuotationPagedPreviewScaler>
            ) : (
              templatePreview
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="rounded!"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded!"
              onClick={() => void onExportImage()}
            >
              <Download className="size-4" />
              Download image
            </Button>
            <Button
              type="button"
              className="rounded! bg-brand-primary! text-white! hover:bg-brand-primary-700!"
              onClick={() => void onExportPdf()}
            >
              <FileText className="size-4" />
              Export PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
