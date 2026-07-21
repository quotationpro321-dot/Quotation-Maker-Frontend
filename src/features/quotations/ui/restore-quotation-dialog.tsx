"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { useRestoreQuotationMutation } from "@/redux/api/quotations.api";
import type { TQuotationListItem } from "@/types/quotation.type";

type TRestoreQuotationDialogProps = {
  quotation: TQuotationListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RestoreQuotationDialog({
  quotation,
  open,
  onOpenChange,
}: TRestoreQuotationDialogProps) {
  const [restoreQuotation, { isLoading }] = useRestoreQuotationMutation();

  const handleRestore = async () => {
    if (!quotation) return;
    try {
      await restoreQuotation(quotation.id).unwrap();
      toast.success("Quotation restored", {
        description: `${quotation.refId} is available again.`,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error("Could not restore quotation", {
        description: extractApiErrorMessage(error, "Please try again."),
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Restore quotation?</AlertDialogTitle>
          <AlertDialogDescription>
            {quotation
              ? `${quotation.refId} for ${quotation.customerName} will return to the quotation lists.`
              : "This quotation will return to the active list."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            disabled={isLoading}
            className="gap-2 rounded! bg-brand-primary! text-white!"
            onClick={() => void handleRestore()}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Restore
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
