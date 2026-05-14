"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";

export const SidebarProfileSection = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 pb-3"}`}>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#204F54] p-3">
                <span className="text-lg font-bold text-white">AS</span>
              </div>

              {!isCollapsed && (
                <Link href="/">
                  <p className="font-black text-foreground">ALSAMA</p>
                  <p className="text-sm text-muted-foreground">Admin Panel</p>
                </Link>
              )}
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
