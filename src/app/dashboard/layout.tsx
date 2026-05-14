import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SIDEBAR_STATE_COOKIE_NAME } from "@/constants/sidebar-state";
import { SessionProvider } from "@/contexts/SessionContext";
import { AuthStateSync } from "@/features/auth";
import { validateSession } from "@/lib/session";
import { IChildren } from "@/types/common.type";

export default async function DashboardLayout({ children }: IChildren) {
  const cookieStore = await cookies();
  const session = validateSession(cookieStore.get("refreshToken")?.value);

  // Defense in depth — the proxy already gates this route.
  if (!session) {
    redirect("/auth/login");
  }

  const sidebarOpenCookie = cookieStore.get(SIDEBAR_STATE_COOKIE_NAME)?.value;
  const sidebarDefaultOpen = sidebarOpenCookie !== "false";

  return (
    <SessionProvider session={session}>
      <AuthStateSync />
      <SidebarProvider defaultOpen={sidebarDefaultOpen}>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="min-h-0 min-w-0 flex-1 p-4 md:p-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
