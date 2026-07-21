"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { quotationBinColumns } from "@/features/quotations/ui/quotation-bin-columns";
import { useListDeletedQuotationsQuery } from "@/redux/api/quotations.api";
import type { TListQuotationsParams, TQuotationListItem } from "@/types/quotation.type";

type TUseQuotationBinOptions = {
  search: string;
  onRestore: (quotation: TQuotationListItem) => void;
};

export function useQuotationBin({ search, onRestore }: TUseQuotationBinOptions) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "deletedAt", desc: true },
  ]);

  const queryParams = useMemo<TListQuotationsParams>(() => {
    const sort = sorting[0];
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search.trim() || undefined,
      sortBy: sort?.id === "deletedAt" ? "deletedAt" : "quotationDate",
      sortOrder: sort?.desc === false ? "asc" : "desc",
    };
  }, [pagination.pageIndex, pagination.pageSize, search, sorting]);

  const query = useListDeletedQuotationsQuery(queryParams);
  const listData = query.data?.data;
  const meta = useMemo(() => ({ onRestore }), [onRestore]);

  const table = useReactTable({
    data: listData?.items ?? [],
    columns: quotationBinColumns,
    pageCount: listData?.pagination.totalPages ?? 0,
    state: { pagination, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    meta,
  });

  return {
    table,
    totalRows: listData?.pagination.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
