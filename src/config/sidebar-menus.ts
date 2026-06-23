import { UserRole } from "@/types/user.type";
import {
  BarChart3,
  Calculator,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Plane,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

export interface SidebarMenuItem {
  title: string;
  icon: React.ElementType;
  href: string;
  exact?: boolean;
}

export const sidebarMenus: Record<UserRole, SidebarMenuItem[]> = {
  admin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard/admin",
      exact: true,
    },
    {
      title: "All Quotation",
      icon: FolderOpen,
      href: "/dashboard/admin/all-quotation",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/dashboard/admin/analytics",
    },
    {
      title: "Calculator",
      icon: Calculator,
      href: "/dashboard/admin/calculator?new=1",
    },
    {
      title: "Flight Converter",
      icon: Plane,
      href: "/dashboard/admin/flight-converter",
    },
    {
      title: "My Quotation",
      icon: FileText,
      href: "/dashboard/admin/my-quotation",
    },
    {
      title: "Users",
      icon: Users,
      href: "/dashboard/admin/users",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/admin/settings",
    },
  ],
  employee: [
    {
      title: "Dashboard",
      icon: UserCog,
      href: "/dashboard/employee",
      exact: true,
    },
    {
      title: "Calculator",
      icon: Calculator,
      href: "/dashboard/employee/calculator?new=1",
    },
    {
      title: "Flight Converter",
      icon: Plane,
      href: "/dashboard/employee/flight-converter",
    },
    {
      title: "My Quotation",
      icon: FileText,
      href: "/dashboard/employee/my-quotation",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/employee/settings",
    },
  ],
};
