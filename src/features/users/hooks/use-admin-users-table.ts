"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useMemo, useState } from "react";

import { useListAdminUsersQuery } from "@/redux/api/users.api";
import type { TAdminUser, TListAdminUsersParams, TUserRole, TUserStatus } from "@/types/admin-user.type";

import {
  usersTableColumns,
  type TUsersTableMeta,
} from "@/features/users/ui/users-table-columns";

const DEFAULT_PAGE_SIZE = 15;

function sortingToQuery(sorting: SortingState): Pick<TListAdminUsersParams, "sortBy" | "sortOrder"> {
  const first = sorting[0];
  if (!first) return { sortBy: "createdAt", sortOrder: "desc" };

  const sortByMap: Record<string, TListAdminUsersParams["sortBy"]> = {
    name: "name",
    email: "email",
    role: "role",
    status: "status",
    createdAt: "createdAt",
  };

  const sortBy = sortByMap[first.id] ?? "createdAt";
  return { sortBy, sortOrder: first.desc ? "desc" : "asc" };
}

type TUseAdminUsersTableOptions = {
  search: string;
  roleFilter?: TUserRole;
  statusFilter?: TUserStatus;
  onEdit: (user: TAdminUser) => void;
  onDelete: (user: TAdminUser) => void;
  onRestore: (user: TAdminUser) => void;
};

export function useAdminUsersTable({
  search,
  roleFilter,
  statusFilter,
  onEdit,
  onDelete,
  onRestore,
}: TUseAdminUsersTableOptions) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const queryParams = useMemo<TListAdminUsersParams>(() => {
    const sort = sortingToQuery(sorting);
    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search.trim() || undefined,
      role: roleFilter,
      status: statusFilter,
      ...sort,
    };
  }, [pagination.pageIndex, pagination.pageSize, search, roleFilter, statusFilter, sorting]);

  const { data, isLoading, isFetching, isError, refetch } = useListAdminUsersQuery(queryParams);

  const users = data?.data.items ?? [];
  const totalRows = data?.data.pagination.total ?? 0;
  const pageCount = data?.data.pagination.totalPages ?? 1;

  const meta = useMemo<TUsersTableMeta>(
    () => ({ onEdit, onDelete, onRestore }),
    [onEdit, onDelete, onRestore],
  );

  const table = useReactTable({
    data: users,
    columns: usersTableColumns,
    pageCount,
    state: { sorting, pagination, rowSelection },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,
    meta,
  });

  const resetPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const clearSelection = useCallback(() => {
    setRowSelection({});
  }, []);

  return {
    table,
    users,
    totalRows,
    isLoading,
    isFetching,
    isError,
    refetch,
    resetPage,
    rowSelection,
    clearSelection,
  };
}
