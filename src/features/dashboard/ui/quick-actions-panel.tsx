import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TQuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type TQuickActionsPanelProps = {
  actions: TQuickAction[];
  title?: string;
};

export function QuickActionsPanel({
  actions,
  title = "Quick Actions",
}: TQuickActionsPanelProps) {
  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group flex items-start gap-3 rounded! border border-border bg-muted/20 p-4 transition-colors",
                "hover:border-brand-primary/30 hover:bg-brand-primary/5",
              )}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded! bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                <action.icon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="font-semibold leading-tight">{action.label}</p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
