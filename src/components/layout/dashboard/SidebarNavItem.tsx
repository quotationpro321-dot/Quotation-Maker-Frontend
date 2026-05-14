"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarMenuItem as SidebarItem } from "@/config/sidebar-menus";
import { cn } from "@/lib/utils";
import { useNavActive } from "@/utils/useNavActive.utils";
import Link from "next/link";

export const SidebarNavItem = ({ item }: { item: SidebarItem }) => {
  const isActive = useNavActive(item.href, item.exact);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "hover:bg-brand-primary hover:text-white hover:font-bold rounded",
          isActive && "bg-brand-primary! text-white! font-bold!",
        )}
      >
        <Link
          prefetch={false}
          href={item.href}
          className="flex items-center gap-1 text-base font-semibold transition-colors duration-300 capitalize"
        >
          <Icon className="h-5 w-5" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
