"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TDataTablePaginationProps<TData> = {
  table: Table<TData>;
  totalRows: number;
  pageSizeOptions?: number[];
  className?: string;
};

export function DataTablePagination<TData>({
  table,
  totalRows,
  pageSizeOptions = [10, 15, 25, 50],
  className,
}: TDataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();

  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  const pageNumbers = buildPageNumbers(pageIndex + 1, pageCount);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-border px-2 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap">Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger size="sm" className="h-8 w-[4.5rem] rounded">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <span className="whitespace-nowrap">
          {from}-{to} of {totalRows} rows
        </span>
      </div>

      <div className="flex items-center justify-end gap-1">
        <PaginationIconButton
          label="First page"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.setPageIndex(0)}
        >
          <ChevronsLeft className="size-4" />
        </PaginationIconButton>
        <PaginationIconButton
          label="Previous page"
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
        >
          <ChevronLeft className="size-4" />
        </PaginationIconButton>

        {pageNumbers.map((page, idx) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
              …
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={page === pageIndex + 1 ? "default" : "outline"}
              size="sm"
              className="size-8 px-0"
              onClick={() => table.setPageIndex(page - 1)}
            >
              {page}
            </Button>
          ),
        )}

        <PaginationIconButton
          label="Next page"
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
        >
          <ChevronRight className="size-4" />
        </PaginationIconButton>
        <PaginationIconButton
          label="Last page"
          disabled={!table.getCanNextPage()}
          onClick={() => table.setPageIndex(pageCount - 1)}
        >
          <ChevronsRight className="size-4" />
        </PaginationIconButton>
      </div>
    </div>
  );
}

function PaginationIconButton({
  label,
  children,
  disabled,
  onClick,
}: {
  label: string;
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      className="size-8"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function buildPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let p = start; p <= end; p += 1) {
    pages.push(p);
  }

  if (current < total - 2) pages.push("ellipsis");

  if (total > 1) pages.push(total);

  return pages;
}
