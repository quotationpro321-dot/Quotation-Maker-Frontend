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
import { getQuotationTemplate } from "@/features/quotations/calculator/lib/quotation-template-registry";
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

export function QuotationPreviewDialog({
  open,
  draft,
  activeOptionIndex,
  previewRef,
  onOpenChange,
  onExportImage,
  onExportPdf,
}: TQuotationPreviewDialogProps) {
  const activeOption = draft.options[activeOptionIndex] ?? draft.options[0];
  const template = getQuotationTemplate(draft.templateId);
  const TemplateComponent = template?.component;
  const totals = calculateOptionTotals(activeOption);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden rounded! sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Quotation preview</DialogTitle>
          <DialogDescription>
            Review filled data, then download as image or PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto pr-1">
          <div ref={previewRef} className="rounded! border border-border bg-muted/20 p-4">
            {TemplateComponent ? (
              <TemplateComponent
                draft={draft}
                option={activeOption}
                optionIndex={activeOptionIndex}
                totals={totals}
                currency={draft.currency}
              />
            ) : null}
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
