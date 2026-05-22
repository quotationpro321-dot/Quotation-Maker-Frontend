import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TDashboardQuotationStatus } from "@/types/dashboard-overview.type";

const statusStyles: Record<TDashboardQuotationStatus, string> = {
  draft: "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  confirmed:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

const statusLabels: Record<TDashboardQuotationStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

type TQuotationStatusBadgeProps = {
  status: TDashboardQuotationStatus;
};

export function QuotationStatusBadge({ status }: TQuotationStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("font-normal uppercase", statusStyles[status])}
    >
      {statusLabels[status]}
    </Badge>
  );
}
