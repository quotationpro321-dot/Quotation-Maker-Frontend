"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { authApi, useLogoutMutation } from "@/redux/api/auth.api";
import { clearUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { clearCachedProfile } from "@/lib/auth-profile-storage";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import getInitialsName from "@/utils/getInitialsName";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, startTransition, useCallback, useMemo } from "react";
import { toast } from "sonner";

export const DashboardHeader = memo(() => {
  const { role, email, name, photo, isLoggedIn, userId } = useUser();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useRouter();

  const settingsHref = useMemo(
    () =>
      role === "admin"
        ? "/dashboard/admin/settings"
        : "/dashboard/employee/settings",
    [role],
  );

  const displayLabel = name?.trim() || email || "Account";
  const photoUrl = photo?.trim();
  const avatarInitials =
    getInitialsName(name?.trim()) || getInitialsName(email) || "?";

  const handleLogout = useCallback(async () => {
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
  }, [dispatch, logout, navigate, userId]);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator orientation="vertical" className="mr-2 bg-border" />
      </div>

      <div className="ml-auto flex items-center gap-3 px-4">
        <AnimatedThemeToggler
          variant="circle"
          // className="size-9 rounded-full border border-border bg-background text-foreground hover:bg-muted"
          aria-label="Toggle theme"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isLoggingOut}
              className="size-9 shrink-0 rounded-full focus-visible:ring-2 focus-visible:ring-ring/60"
              aria-label={`Open account menu for ${displayLabel}`}
              aria-haspopup="menu"
            >
              <Avatar className="size-8">
                {photoUrl ? <AvatarImage src={photoUrl} alt="" /> : null}
                <AvatarFallback className="bg-[#1f4f55] text-white font-semibold rounded">
                  {isLoggedIn ? avatarInitials : "?"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56 rounded">
            <DropdownMenuItem asChild>
              <Link href={settingsHref} className="cursor-pointer">
                <Settings className="mr-2 size-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-[#204F54] focus:bg-[#204F5412] focus:text-[#204F54]"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="mr-2 size-4 text-[#204F54]" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
