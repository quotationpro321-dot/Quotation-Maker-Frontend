"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import type { TListQuotationsParams, TQuotationListItem } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

import {
  getMockCurrentUserIds,
  queryMockQuotations,
} from "@/features/quotations/lib/quotations-mock-data";
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
  currentUserId?: string;
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
  currentUserId,
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
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());

  const resolvedUserId = useMemo(() => {
    if (currentUserId) return currentUserId;
    const ids = getMockCurrentUserIds();
    return role === "admin" ? ids.admin : ids.employee;
  }, [currentUserId, role]);

  const queryParams = useMemo<TListQuotationsParams>(() => {
    const sort = sortingToQuery(sorting);
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search.trim() || undefined,
      status: statusFilter,
      createdById: scope === "mine" ? resolvedUserId : undefined,
      ...sort,
    };
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    resolvedUserId,
    scope,
    search,
    sorting,
    statusFilter,
  ]);

  const listData = useMemo(
    () => queryMockQuotations(queryParams, removedIds),
    [queryParams, removedIds],
  );

  const meta = useMemo<TQuotationsTableMeta>(
    () => ({ onView, onEdit, onDuplicate, onDelete, role }),
    [onDelete, onDuplicate, onEdit, onView, role],
  );

  const table = useReactTable({
    data: listData.items,
    columns: quotationsTableColumns,
    pageCount: listData.pagination.totalPages,
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

  const removeQuotation = useCallback((id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  }, []);

  return {
    table,
    quotations: listData.items,
    totalRows: listData.pagination.total,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: () => undefined,
    resetPage,
    removeQuotation,
  };
}
