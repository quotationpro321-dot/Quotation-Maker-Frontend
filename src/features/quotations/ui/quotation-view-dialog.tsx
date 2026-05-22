"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TQuotationListItem } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

import {
  formatQuotationDate,
  formatQuotationReference,
  formatQuotationTotal,
} from "@/features/quotations/lib/format-quotation";
import { getQuotationEditPath } from "@/features/quotations/lib/quotation-paths";
import { QuotationStatusBadge } from "@/features/dashboard/ui/quotation-status-badge";

type TQuotationViewDialogProps = {
  quotation: TQuotationListItem | null;
  role: UserRole;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

export function QuotationViewDialog({
  quotation,
  role,
  open,
  onOpenChange,
}: TQuotationViewDialogProps) {
  if (!quotation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="rounded! sm:max-w-lg" />
      </Dialog>
    );
  }

  const editHref = getQuotationEditPath(role, quotation.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded! sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">
            Quotation #{formatQuotationReference(quotation.referenceNumber)}
          </DialogTitle>
          <DialogDescription>
            Read-only summary. Open the calculator to edit full package details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <DetailRow label="Customer" value={quotation.customerName} />
          <DetailRow label="Date" value={formatQuotationDate(quotation.quotationDate)} />
          <DetailRow label="Makkah Hotel" value={quotation.makkahHotel} />
          <DetailRow label="Madina Hotel" value={quotation.madinahHotel} />
          <DetailRow label="Created By" value={quotation.createdBy.name} />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Status
            </p>
            <QuotationStatusBadge status={quotation.status} />
          </div>
          <DetailRow
            label="Estimated Total"
            value={formatQuotationTotal(quotation.totalValue, quotation.currency)}
          />
          {quotation.customerPhone ? (
            <DetailRow label="Phone" value={quotation.customerPhone} />
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            className="rounded!"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button asChild className="rounded! bg-brand-primary! text-white! hover:bg-brand-primary-700!">
            <Link href={editHref}>
              <Pencil className="size-4" aria-hidden />
              Edit in calculator
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
