"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import {
  useListMyQuotationsQuery,
  useListQuotationsQuery,
} from "@/redux/api/quotations.api";
import type { TListQuotationsParams, TQuotationListItem } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

import {
  quotationsTableColumns,
  type TQuotationsTableMeta,
} from "@/features/quotations/ui/quotations-table-columns";

const DEFAULT_PAGE_SIZE = 15;

export type TQuotationsScope = "all" | "mine";

function sortingToQuery(
  sorting: SortingState,
): Pick<TListQuotationsParams, "sortBy" | "sortOrder"> {
  const first = sorting[0];
  if (!first) return { sortBy: "quotationDate", sortOrder: "desc" };

  const allowed = new Set([
    "referenceNumber",
    "customerName",
    "quotationDate",
    "status",
    "createdBy",
  ]);
  const sortBy = allowed.has(first.id) ? first.id : "quotationDate";
  return { sortBy, sortOrder: first.desc ? "desc" : "asc" };
}

type TUseQuotationsTableOptions = {
  scope: TQuotationsScope;
  role: UserRole;
  search: string;
  statusFilter?: TQuotationListItem["status"];
  onView: (quotation: TQuotationListItem) => void;
  onEdit: (quotation: TQuotationListItem) => void;
  onDuplicate: (quotation: TQuotationListItem) => void;
  onDelete: (quotation: TQuotationListItem) => void;
};

export function useQuotationsTable({
  scope,
  role,
  search,
  statusFilter,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: TUseQuotationsTableOptions) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "quotationDate", desc: true },
  ]);

  const queryParams = useMemo<TListQuotationsParams>(() => {
    const sort = sortingToQuery(sorting);
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search.trim() || undefined,
      status: statusFilter,
      ...sort,
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    search,
    sorting,
    statusFilter,
  ]);

  const allQuery = useListQuotationsQuery(queryParams, {
    skip: scope !== "all",
  });
  const mineQuery = useListMyQuotationsQuery(queryParams, {
    skip: scope !== "mine",
  });

  const activeQuery = scope === "all" ? allQuery : mineQuery;
  const listData = activeQuery.data?.data;

  const meta = useMemo<TQuotationsTableMeta>(
    () => ({ onView, onEdit, onDuplicate, onDelete, role }),
    [onDelete, onDuplicate, onEdit, onView, role],
  );

  const table = useReactTable({
    data: listData?.items ?? [],
    columns: quotationsTableColumns,
    pageCount: listData?.pagination.totalPages ?? 0,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    meta,
  });

  const resetPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return {
    table,
    quotations: listData?.items ?? [],
    totalRows: listData?.pagination.total ?? 0,
    isLoading: activeQuery.isLoading,
    isFetching: activeQuery.isFetching,
    isError: activeQuery.isError,
    refetch: activeQuery.refetch,
    resetPage,
  };
}
