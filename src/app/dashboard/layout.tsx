import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IChildren } from "@/types/common.type";

export default function DashboardLayout({ children }: IChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
