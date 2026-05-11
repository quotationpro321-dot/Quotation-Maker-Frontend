"use client";

import AlsamaFaviconSvg from "@/components/common/AlsamaFaviconSvg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useSidebarMenus } from "@/hooks/useSidebarMenus";
import { useUser } from "@/hooks/useUser";
import { clearCachedProfile } from "@/lib/auth-profile-storage";
import { authApi, useLogoutMutation } from "@/redux/api/auth.api";
import { clearUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ChevronDown, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, startTransition } from "react";
import { toast } from "sonner";
import { SidebarNavItem } from "./SidebarNavItem";

export const DashboardSidebar = memo(() => {
  const { role, userId } = useUser();
  const menus = useSidebarMenus(role);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  if (!role || !userId) return null;

  const handleLogout = async () => {
    try {
      await logout(undefined).unwrap();
      if (userId) clearCachedProfile(userId);
      dispatch(clearUser());
      dispatch(authApi.util.resetApiState());

      startTransition(() => {
        navigate.replace("/auth/login");
      });
      toast.success("Logout Successfully");
    } catch {
      toast.error("Logout failed! Try again.");
    }
  };

  const roleInfo =
    role === "admin"
      ? { initial: "A", label: "Admin Panel" }
      : { initial: "E", label: "Employee Panel" };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={roleInfo.label}
                  className="h-16! rounded cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:justify-center"
                >
                  <AlsamaFaviconSvg className="size-9! shrink-0 group-data-[collapsible=icon]:size-8! rounded!" />
                  <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-semibold tracking-wide text-foreground">
                      ALSAMA
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {roleInfo.label}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-default gap-2 p-2 focus:bg-transparent">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <span className="text-xs font-semibold">
                      {roleInfo.initial}
                    </span>
                  </div>
                  <div className="font-medium text-muted-foreground">
                    {roleInfo.label}
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/" className="cursor-pointer">
                    <Home className="mr-2 size-4" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="cursor-pointer text-[#204F54] focus:bg-[#204F5412] focus:text-[#204F54]"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 size-4 text-[#204F54]" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-semibold text-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menus.map((item) => (
                <SidebarNavItem key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              disabled={isLoading}
              onClick={handleLogout}
              tooltip="Logout"
              className="cursor-pointer justify-center bg-brand-primary! font-medium text-white! rounded shadow-sm hover:bg-[#1f4f55]! hover:text-white! group-data-[collapsible=icon]:justify-center"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <LogOut />
                  <span className="group-data-[collapsible=icon]:hidden">
                    Logout
                  </span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
});

DashboardSidebar.displayName = "DashboardSidebar";
