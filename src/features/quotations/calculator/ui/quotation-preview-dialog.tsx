"use client";

import { FileText, Link2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuotationTemplatePreview } from "@/features/quotations/calculator/ui/quotation-template-preview";
import type { TQuotationDraft } from "@/types/quotation.type";

type TQuotationPreviewDialogProps = {
  open: boolean;
  draft: TQuotationDraft;
  activeOptionIndex: number;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onOpenChange: (open: boolean) => void;
  onExportPdf: () => void;
  onShareLink: () => void;
  isSharing?: boolean;
};

export function QuotationPreviewDialog({
  open,
  draft,
  activeOptionIndex,
  previewRef,
  onOpenChange,
  onExportPdf,
  onShareLink,
  isSharing = false,
}: TQuotationPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[min(100vw-2rem,64rem)]! max-w-none! flex-col gap-4 overflow-hidden rounded! p-4 sm:max-w-none!">
        <DialogHeader>
          <DialogTitle>Quotation preview</DialogTitle>
          <DialogDescription>
            Review filled data, then export as PDF or share an HTML view link.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
          <QuotationTemplatePreview
            draft={draft}
            activeOptionIndex={activeOptionIndex}
            previewRef={previewRef}
          />
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
              onClick={onShareLink}
              disabled={isSharing}
            >
              <Link2 className="size-4" />
              Share link
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
