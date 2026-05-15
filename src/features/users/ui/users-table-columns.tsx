"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  AtSign,
  Calendar,
  CircleUserRound,
  Pencil,
  RotateCcw,
  Target,
  Trash2,
  UserRound,
} from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { TAdminUser } from "@/types/admin-user.type";

import { UserStatusBadge } from "@/features/users/ui/user-status-badge";
import {
  formatJoinedDate,
  formatUserRole,
  userInitials,
} from "@/features/users/lib/format-user";

export type TUsersTableMeta = {
  onEdit: (user: TAdminUser) => void;
  onDelete: (user: TAdminUser) => void;
  onRestore: (user: TAdminUser) => void;
};

export const usersTableColumns: ColumnDef<TAdminUser>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Full Name"
        icon={<UserRound className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="size-9 border border-border">
            {user.profilePhotoUrl ? (
              <AvatarImage src={user.profilePhotoUrl} alt="" />
            ) : null}
            <AvatarFallback className="bg-brand-primary text-xs font-semibold text-white">
              {userInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
        icon={<AtSign className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <a
        href={`mailto:${row.original.email}`}
        className="text-foreground underline-offset-4 hover:text-brand-primary hover:underline"
      >
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role"
        icon={<CircleUserRound className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatUserRole(row.original.role)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        icon={<Target className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Joined Date"
        icon={<Calendar className="size-4" aria-hidden />}
      />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{formatJoinedDate(row.original.createdAt)}</span>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as TUsersTableMeta | undefined;
      const user = row.original;
      const isRemoved = user.status === "deleted";

      if (isRemoved) {
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-xs"
              onClick={() => meta?.onRestore(user)}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Restore
            </Button>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-xs"
            onClick={() => meta?.onEdit(user)}
          >
            <Pencil className="size-3.5" aria-hidden />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-xs text-destructive hover:text-destructive"
            onClick={() => meta?.onDelete(user)}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Delete
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
