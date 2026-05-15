"use client";

import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { TAdminUser, TUserRole, TUserStatus } from "@/types/admin-user.type";

import { useUser } from "@/hooks/useUser";
import { useAdminUsersTable } from "@/features/users/hooks/use-admin-users-table";
import { DeleteUserDialog } from "@/features/users/ui/delete-user-dialog";
import { DeleteUsersBulkDialog } from "@/features/users/ui/delete-users-bulk-dialog";
import { RestoreUserDialog } from "@/features/users/ui/restore-user-dialog";
import { UserFormDialog } from "@/features/users/ui/user-form-dialog";
import { UsersTableToolbar } from "@/features/users/ui/users-table-toolbar";

function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export function AdminUsersView() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [roleFilter, setRoleFilter] = useState<TUserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<TUserStatus | "all">("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TAdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TAdminUser | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkDeleteUsers, setBulkDeleteUsers] = useState<TAdminUser[]>([]);
  const [restoreTarget, setRestoreTarget] = useState<TAdminUser | null>(null);
  const { userId: currentUserId } = useUser();

  const handleEdit = useCallback((user: TAdminUser) => {
    setEditingUser(user);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((user: TAdminUser) => {
    setDeleteTarget(user);
  }, []);

  const handleRestore = useCallback((user: TAdminUser) => {
    setRestoreTarget(user);
  }, []);

  const showRemovedOnly = statusFilter === "deleted";

  const {
    table,
    totalRows,
    isLoading,
    isFetching,
    isError,
    refetch,
    resetPage,
    rowSelection,
    clearSelection,
  } = useAdminUsersTable({
      search: debouncedSearch,
      roleFilter: roleFilter === "all" ? undefined : roleFilter,
      statusFilter: statusFilter === "all" ? undefined : statusFilter,
      onEdit: handleEdit,
      onDelete: handleDelete,
      onRestore: handleRestore,
    });

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, roleFilter, statusFilter, resetPage]);

  const selectedUsers = useMemo(
    () => table.getSelectedRowModel().rows.map((row) => row.original),
    [table, rowSelection],
  );
  const selectedCount = selectedUsers.length;

  const handleDeleteSelected = useCallback(() => {
    const deletable = selectedUsers.filter((u) => u._id !== currentUserId);
    if (deletable.length === 0) {
      toast.error("Cannot delete selection", {
        description: "You cannot delete your own account.",
      });
      return;
    }
    if (deletable.length < selectedUsers.length) {
      toast.message("Your account was excluded from this deletion.");
    }
    setBulkDeleteUsers(deletable);
    setBulkDeleteOpen(true);
  }, [currentUserId, selectedUsers]);

  const handleAddUser = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingUser(null);
  };

  return (
    <div className="min-w-0 space-y-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Users</h1>
        <p className="text-sm text-muted-foreground">
          Create, update, and manage team accounts, roles, and access status.
        </p>
      </header>

      <UsersTableToolbar
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddUser={handleAddUser}
        selectedCount={selectedCount}
        onDeleteSelected={handleDeleteSelected}
        showRemovedOnly={showRemovedOnly}
      />

      {showRemovedOnly ? (
        <RemovedUsersAlert totalRows={totalRows} isLoading={isLoading} />
      ) : null}

      {isError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-6 text-center text-sm text-destructive">
          Could not load users.{" "}
          <button type="button" className="underline" onClick={() => void refetch()}>
            Try again
          </button>
        </div>
      ) : isLoading ? (
        <UsersTableSkeleton />
      ) : (
        <div className="relative overflow-hidden rounded-md border border-border bg-card">
          {isFetching ? (
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 bg-brand-primary/60"
              aria-hidden
            />
          ) : null}
          <DataTable
            table={table}
            className="rounded-none border-0 shadow-none"
            emptyMessage={
              showRemovedOnly
                ? "No removed users. Deleted accounts appear here."
                : "No users match your filters."
            }
          />
          <DataTablePagination table={table} totalRows={totalRows} />
        </div>
      )}

      <UserFormDialog open={formOpen} onOpenChange={handleFormOpenChange} user={editingUser} />

      <DeleteUserDialog
        user={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      />

      <RestoreUserDialog
        user={restoreTarget}
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
        onRestored={() => void refetch()}
      />

      <DeleteUsersBulkDialog
        users={bulkDeleteUsers}
        open={bulkDeleteOpen}
        onOpenChange={(open) => {
          setBulkDeleteOpen(open);
          if (!open) setBulkDeleteUsers([]);
        }}
        onDeleted={() => {
          clearSelection();
          setBulkDeleteUsers([]);
          void refetch();
        }}
      />
    </div>
  );
}

const REMOVED_RETENTION_DAYS = 60;

type TRemovedUsersAlertProps = {
  totalRows: number;
  isLoading: boolean;
};

function RemovedUsersAlert({ totalRows, isLoading }: TRemovedUsersAlertProps) {
  const countLabel =
    isLoading ? "Loading removed users…" : `${totalRows} removed account${totalRows === 1 ? "" : "s"}`;

  return (
    <div
      role="alert"
      className="flex gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
      <div className="min-w-0 space-y-1">
        <p className="font-medium">{countLabel}</p>
        <p className="text-amber-900/90 dark:text-amber-100/90">
          These users cannot sign in. Use <strong>Restore</strong> within{" "}
          {REMOVED_RETENTION_DAYS} days to reactivate the same account and password, or{" "}
          <strong>Add user</strong> with the same email to set new details. After{" "}
          {REMOVED_RETENTION_DAYS} days, personal data is anonymized automatically and restore
          is no longer available.
        </p>
      </div>
    </div>
  );
}

function UsersTableSkeleton() {
  return (
    <div className="space-y-3 rounded-md border border-border p-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
