import type { ReactNode } from "react";

type TDashboardPageHeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export function DashboardPageHeader({
  title,
  subtitle,
  action,
}: TDashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          {subtitle}
        </p>
      </div>
      {action}
    </div>
  );
}
