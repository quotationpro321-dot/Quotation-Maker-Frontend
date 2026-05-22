import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";

import type { TDashboardStat } from "@/types/dashboard-overview.type";

import { StatCard } from "@/features/dashboard/ui/stat-card";

const STAT_ICONS: Record<string, LucideIcon> = {
  totalUsers: Users,
  totalAdmins: Shield,
  totalEmployees: UserCheck,
  totalQuotations: FolderOpen,
  pendingApproval: Clock3,
  confirmedDeals: CheckCircle2,
  activeAgents: Briefcase,
  myQuotations: FileText,
  drafts: FileText,
};

type TStatCardsGridProps = {
  stats: TDashboardStat[];
  featuredKey?: string;
};

export function StatCardsGrid({ stats, featuredKey }: TStatCardsGridProps) {
  const primaryStats = stats.slice(0, 4);
  const secondaryStats = stats.slice(4);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((stat) => (
          <StatCard
            key={stat.key}
            stat={stat}
            icon={STAT_ICONS[stat.key] ?? FileText}
            featured={stat.key === featuredKey}
          />
        ))}
      </div>
      {secondaryStats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {secondaryStats.map((stat) => (
            <StatCard
              key={stat.key}
              stat={stat}
              icon={STAT_ICONS[stat.key] ?? FileText}
            />
          ))}
        </div>
      )}
    </div>
  );
}
