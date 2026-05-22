"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Calendar, Hash, Hotel, UserRound } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { TQuotationListItem } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

import {
  formatQuotationDate,
  formatQuotationReference,
} from "@/features/quotations/lib/format-quotation";
import { QuotationRowActions } from "@/features/quotations/ui/quotation-row-actions";
import { QuotationStatusBadge } from "@/features/dashboard/ui/quotation-status-badge";

export type TQuotationsTableMeta = {
  onView: (quotation: TQuotationListItem) => void;
  onEdit: (quotation: TQuotationListItem) => void;
  onDuplicate: (quotation: TQuotationListItem) => void;
  onDelete: (quotation: TQuotationListItem) => void;
  role: UserRole;
};

export const quotationsTableColumns: ColumnDef<TQuotationListItem>[] = [
  {
    accessorKey: "referenceNumber",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ID"
        icon={<Hash className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="font-mono font-medium">
        {formatQuotationReference(row.original.referenceNumber)}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Customer Name"
        icon={<UserRound className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.customerName}</span>
    ),
  },
  {
    accessorKey: "quotationDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Date"
        icon={<Calendar className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => formatQuotationDate(row.original.quotationDate),
  },
  {
    accessorKey: "makkahHotel",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Makkah Hotel"
        icon={<Hotel className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate">{row.original.makkahHotel}</span>
    ),
  },
  {
    accessorKey: "madinahHotel",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Madina Hotel"
        icon={<Hotel className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="block max-w-[220px] truncate">{row.original.madinahHotel}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <QuotationStatusBadge status={row.original.status} />,
  },
  {
    id: "createdBy",
    accessorFn: (row) => row.createdBy.name,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created By"
        icon={<UserRound className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => row.original.createdBy.name,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TQuotationsTableMeta | undefined;
      if (!meta) return null;

      return (
        <QuotationRowActions
          quotation={row.original}
          role={meta.role}
          onView={meta.onView}
          onEdit={meta.onEdit}
          onDuplicate={meta.onDuplicate}
          onDelete={meta.onDelete}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
