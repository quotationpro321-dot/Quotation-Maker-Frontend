"use client";

import { useState } from "react";
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
import type { TQuotationListItem } from "@/types/quotation.type";

type TDeleteQuotationDialogProps = {
  quotation: TQuotationListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (quotation: TQuotationListItem) => void | Promise<void>;
};

export function DeleteQuotationDialog({
  quotation,
  open,
  onOpenChange,
  onConfirmDelete,
}: TDeleteQuotationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!quotation) return;
    setIsLoading(true);
    try {
      await onConfirmDelete(quotation);
      toast.success("Quotation deleted", {
        description: `Reference #${quotation.referenceNumber} for ${quotation.customerName} was removed.`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Could not delete quotation", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isLoading && onOpenChange(next)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete quotation?</AlertDialogTitle>
          <AlertDialogDescription>
            {quotation
              ? `This will permanently remove quotation #${quotation.referenceNumber} for ${quotation.customerName}. This action cannot be undone.`
              : "This action cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            variant="destructive"
            disabled={isLoading}
            className="gap-2 rounded!"
            onClick={() => void handleDelete()}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
