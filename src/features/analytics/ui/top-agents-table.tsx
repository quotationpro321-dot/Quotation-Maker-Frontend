import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TAnalyticsAgentRow } from "@/types/analytics-overview.type";

import { formatCurrency } from "@/features/dashboard/lib/format-dashboard";

type TTopAgentsTableProps = {
  agents: TAnalyticsAgentRow[];
};

export function TopAgentsTable({ agents }: TTopAgentsTableProps) {
  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">
          Agent Performance
        </CardTitle>
        <CardDescription>
          Ranked by quotation volume and confirmed revenue.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Agent</TableHead>
                <TableHead className="text-right">Quotations</TableHead>
                <TableHead className="text-right">Confirmed</TableHead>
                <TableHead className="pr-6 text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="pl-6 font-medium">{agent.name}</TableCell>
                  <TableCell className="text-right">{agent.quotations}</TableCell>
                  <TableCell className="text-right">{agent.confirmed}</TableCell>
                  <TableCell className="pr-6 text-right font-semibold">
                    {formatCurrency(agent.revenue, agent.currency)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
