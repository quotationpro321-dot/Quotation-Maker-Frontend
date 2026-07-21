"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  QUOTATION_STATUS_OPTIONS,
  useUpdateQuotationStatusForm,
} from "@/features/quotations/hooks/use-update-quotation-status-form";
import { formatQuotationRefId } from "@/features/quotations/lib/format-quotation";
import type { TQuotationListItem, TQuotationStatus } from "@/types/quotation.type";

type TUpdateQuotationStatusDialogProps = {
  quotation: TQuotationListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateQuotationStatusDialog({
  quotation,
  open,
  onOpenChange,
}: TUpdateQuotationStatusDialogProps) {
  const form = useUpdateQuotationStatusForm({ quotation, open, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={(next) => !form.isSaving && onOpenChange(next)}>
      <DialogContent className="rounded! sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">Update status</DialogTitle>
          <DialogDescription>
            {quotation
              ? `Change status for ${formatQuotationRefId(quotation.refId)} (${quotation.customerName}).`
              : "Change quotation status."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quotation-status">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => form.setStatus(value as TQuotationStatus)}
              disabled={form.isSaving}
            >
              <SelectTrigger id="quotation-status" className="w-full rounded!">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {QUOTATION_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.status === "confirmed" ? (
            <div className="space-y-2">
              <Label htmlFor="completed-option">Completed option</Label>
              {form.isLoadingOptions ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Loading options…
                </p>
              ) : null}
              {form.hasOptionError ? (
                <p className="text-sm text-destructive">
                  Could not load quotation options. Please try again.
                </p>
              ) : null}
              {!form.isLoadingOptions && !form.hasOptionError ? (
                <Select
                  value={form.completedOptionId}
                  onValueChange={form.setCompletedOptionId}
                  disabled={form.isSaving || form.optionChoices.length === 0}
                >
                  <SelectTrigger id="completed-option" className="w-full rounded!">
                    <SelectValue placeholder="Select one option" />
                  </SelectTrigger>
                  <SelectContent>
                    {form.optionChoices.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Only one option can be marked completed for a confirmed quotation.
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded!"
            disabled={form.isSaving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="gap-2 rounded! bg-brand-primary! text-white! hover:bg-brand-primary-700!"
            disabled={!form.canSave}
            onClick={() => void form.saveStatus()}
          >
            {form.isSaving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : null}
            Save status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
