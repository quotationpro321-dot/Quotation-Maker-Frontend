import type { IDashboardProfile } from "@/types/dashboard-profile.type";
import type { UserRole } from "@/types/user.type";

export function toUserRole(role: string): UserRole {
  return role === "employee" ? "employee" : "admin";
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0]!}${parts[parts.length - 1]![0]!}`.toUpperCase();
}

export function profileToFormState(p: IDashboardProfile) {
  return {
    name: p.name,
    email: p.email,
    whatsappNumber: p.whatsappNumber ?? "",
    consultantDesignation: p.consultantDesignation ?? "",
    profilePhotoUrl: p.profilePhotoUrl ?? "",
  };
}

export type TProfileFormState = ReturnType<typeof profileToFormState>;
