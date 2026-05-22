import { getDashboardPaths } from "@/features/dashboard/lib/dashboard-paths";
import type { UserRole } from "@/types/user.type";

export function getQuotationPaths(role: UserRole) {
  if (role === "admin") {
    const paths = getDashboardPaths("admin");
    return {
      calculator: paths.calculator,
      allQuotations: paths.allQuotation,
      myQuotations: paths.myQuotation,
    };
  }

  const paths = getDashboardPaths("employee");
  return {
    calculator: paths.calculator,
    allQuotations: undefined,
    myQuotations: paths.myQuotation,
  };
}

export function getQuotationEditPath(role: UserRole, quotationId: string): string {
  const { calculator } = getQuotationPaths(role);
  return `${calculator}?id=${encodeURIComponent(quotationId)}`;
}
