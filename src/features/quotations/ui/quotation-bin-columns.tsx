"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Hash, RotateCcw } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  formatQuotationDate,
  formatQuotationRefId,
  formatQuotationType,
} from "@/features/quotations/lib/format-quotation";
import type { TQuotationListItem } from "@/types/quotation.type";

const RETENTION_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

type TQuotationBinMeta = {
  onRestore: (quotation: TQuotationListItem) => void;
};

function getDaysRemaining(deletedAt: string | undefined): number {
  if (!deletedAt) return 0;
  const expiresAt = new Date(deletedAt).getTime() + RETENTION_DAYS * DAY_MS;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / DAY_MS));
}

export const quotationBinColumns: ColumnDef<TQuotationListItem>[] = [
  {
    accessorKey: "refId",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Ref ID"
        icon={<Hash className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {formatQuotationRefId(row.original.refId)}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.customerName}</span>
    ),
  },
  {
    accessorKey: "calculatorType",
    header: "Quotation Type",
    cell: ({ row }) => formatQuotationType(row.original.calculatorType),
  },
  {
    accessorKey: "deletedAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Deleted"
        icon={<Calendar className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) =>
      row.original.deletedAt
        ? formatQuotationDate(row.original.deletedAt)
        : "—",
  },
  {
    id: "expiresIn",
    header: "Permanent deletion",
    cell: ({ row }) => {
      const days = getDaysRemaining(row.original.deletedAt);
      return `${days} day${days === 1 ? "" : "s"}`;
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TQuotationBinMeta | undefined;
      return (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded!"
          onClick={() => meta?.onRestore(row.original)}
        >
          <RotateCcw className="size-4" aria-hidden />
          Restore
        </Button>
      );
    },
    enableSorting: false,
  },
];
