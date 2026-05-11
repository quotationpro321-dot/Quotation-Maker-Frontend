import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthStateSync } from "@/components/auth/AuthStateSync";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SIDEBAR_STATE_COOKIE_NAME } from "@/constants/sidebar-state";
import { SessionProvider } from "@/contexts/SessionContext";
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
          <main className="p-4 md:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
