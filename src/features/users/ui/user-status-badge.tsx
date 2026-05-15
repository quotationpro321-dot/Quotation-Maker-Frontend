import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TUserStatus } from "@/types/admin-user.type";

import { formatUserStatus } from "@/features/users/lib/format-user";

const statusStyles: Partial<Record<TUserStatus, string>> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  inactive: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
  blocked: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  banned: "border-destructive/30 bg-destructive/10 text-destructive",
  deleted: "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
};

type TUserStatusBadgeProps = {
  status: TUserStatus;
  className?: string;
};

export function UserStatusBadge({ status, className }: TUserStatusBadgeProps) {
  const isActive = status === "active";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-normal",
        statusStyles[status] ?? "text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-emerald-500" : status === "inactive" ? "bg-red-500" : "bg-muted-foreground",
        )}
        aria-hidden
      />
      {formatUserStatus(status)}
    </Badge>
  );
}
