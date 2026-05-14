"use client";

import { sidebarMenus } from "@/config/sidebar-menus";
import { UserRole } from "@/types/user.type";

export function useSidebarMenus(role: UserRole | undefined) {
  if (!role) return [];
  return sidebarMenus[role] ?? [];
}
