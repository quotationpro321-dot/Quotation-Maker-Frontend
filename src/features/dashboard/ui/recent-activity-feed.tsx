import Link from "next/link";
import { Activity } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TDashboardActivity } from "@/types/dashboard-overview.type";

import { formatRelativeTime } from "@/features/dashboard/lib/format-dashboard";

type TRecentActivityFeedProps = {
  items: TDashboardActivity[];
  viewAllHref?: string;
};

export function RecentActivityFeed({
  items,
  viewAllHref,
}: TRecentActivityFeedProps) {
  return (
    <Card className="flex h-full flex-col rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">Live Feed</CardTitle>
        <CardDescription>Recent system events</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <Activity className="size-8 opacity-50" aria-hidden />
            <p className="text-sm">No recent activity yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="bg-brand-primary/10 text-xs font-semibold text-brand-primary">
                    {item.actorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{item.actorName}</span>{" "}
                    <span className="text-muted-foreground">{item.action}</span>
                    {item.reference && (
                      <span className="font-medium text-brand-primary">
                        {" "}
                        {item.reference}
                      </span>
                    )}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {formatRelativeTime(item.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {viewAllHref && (
          <Button
            asChild
            variant="outline"
            className="mt-auto w-full rounded! border-dashed"
          >
            <Link href={viewAllHref}>View all activity</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
