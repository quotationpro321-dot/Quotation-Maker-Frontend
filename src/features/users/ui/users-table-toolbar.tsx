"use client";

import { Loader2, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authPrimaryButtonClassName } from "@/features/auth/constants";
import type { TUserRole, TUserStatus } from "@/types/admin-user.type";
import { cn } from "@/lib/utils";

type TUsersTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: TUserRole | "all";
  onRoleFilterChange: (value: TUserRole | "all") => void;
  statusFilter: TUserStatus | "all";
  onStatusFilterChange: (value: TUserStatus | "all") => void;
  onAddUser: () => void;
  selectedCount: number;
  onDeleteSelected?: () => void;
  isDeletingSelected?: boolean;
};

/** Shared height + surface for search and filter controls in the toolbar row. */
const toolbarControlClassName =
  "!h-10 min-h-10 rounded border-input bg-muted/40 py-0 text-sm dark:bg-input/30";

const toolbarSelectTriggerClassName = cn(
  toolbarControlClassName,
  "w-full px-3 sm:w-[140px]",
  "!h-10 data-[size=default]:!h-10 data-[size=sm]:!h-10",
);

export function UsersTableToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  onAddUser,
  selectedCount,
  onDeleteSelected,
  isDeletingSelected = false,
}: TUsersTableToolbarProps) {
  const hasSelection = selectedCount > 0;
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name or email…"
            className={cn(toolbarControlClassName, "pl-9")}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => onRoleFilterChange(v as TUserRole | "all")}
        >
          <SelectTrigger className={toolbarSelectTriggerClassName}>
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusFilterChange(v as TUserStatus | "all")}
        >
          <SelectTrigger className={toolbarSelectTriggerClassName}>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {hasSelection ? (
          <>
            <p className="text-sm text-muted-foreground">
              {selectedCount} selected
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={isDeletingSelected}
              className="h-10 gap-2 rounded-xs border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={onDeleteSelected}
            >
              {isDeletingSelected ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
              Delete selected
            </Button>
          </>
        ) : null}
        <Button
          type="button"
          className={cn("h-10 gap-2 rounded-xs", authPrimaryButtonClassName)}
          onClick={onAddUser}
        >
          <Plus className="size-4" aria-hidden />
          Add user
        </Button>
      </div>
    </div>
  );
}
