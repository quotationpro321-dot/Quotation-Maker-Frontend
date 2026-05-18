import {
  BarChart3,
  Calculator,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Plane,
  Settings,
  User,
  Users,
} from "lucide-react";

export interface SidebarItem {
  title: string;
  icon: React.ElementType;
  href: string;
  exact?: boolean;
}

export const sidebarMenus: SidebarItem[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    href: "/dashboard",
    exact: true,
  },
  {
    title: "Admin",
    icon: User,
    href: "/dashboard/admin",
  },
  {
    title: "Employee",
    icon: Users,
    href: "/dashboard/employee",
  },
  {
    title: "All Quotation",
    icon: FolderOpen,
    href: "/dashboard/employee/all-quotation",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/dashboard/employee/analytics",
  },
  {
    title: "Calculator",
    icon: Calculator,
    href: "/dashboard/employee/calculator",
  },
  {
    title: "Employee Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard/employee/dashboard",
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
  {
    title: "Users",
    icon: Users,
    href: "/dashboard/employee/users",
  },
];
