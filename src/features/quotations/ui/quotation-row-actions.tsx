"use client";

import Link from "next/link";
import {
  Copy,
  Eye,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TQuotationListItem } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

import { getQuotationEditPath } from "@/features/quotations/lib/quotation-paths";

type TQuotationRowActionsProps = {
  quotation: TQuotationListItem;
  role: UserRole;
  onView: (quotation: TQuotationListItem) => void;
  onEdit: (quotation: TQuotationListItem) => void;
  onDuplicate: (quotation: TQuotationListItem) => void;
  onUpdateStatus: (quotation: TQuotationListItem) => void;
  onDelete: (quotation: TQuotationListItem) => void;
};

export function QuotationRowActions({
  quotation,
  role,
  onView,
  onEdit,
  onDuplicate,
  onUpdateStatus,
  onDelete,
}: TQuotationRowActionsProps) {
  const editHref = getQuotationEditPath(role, quotation.id);

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded!"
            aria-label="Row actions"
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onView(quotation)}>
            <Eye className="size-4" aria-hidden />
            View
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={editHref} onClick={() => onEdit(quotation)}>
              <Pencil className="size-4" aria-hidden />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDuplicate(quotation)}>
            <Copy className="size-4" aria-hidden />
            Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(quotation)}>
            <RefreshCw className="size-4" aria-hidden />
            Update status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(quotation)}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
