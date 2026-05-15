import type { TUserRole, TUserStatus } from "@/types/admin-user.type";

export function formatUserRole(role: TUserRole): string {
  return role === "admin" ? "Admin" : "Employee";
}

export function formatUserStatus(status: TUserStatus): string {
  const labels: Record<TUserStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    blocked: "Blocked",
    banned: "Banned",
    deleted: "Deleted",
  };
  return labels[status] ?? status;
}

export function formatJoinedDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
