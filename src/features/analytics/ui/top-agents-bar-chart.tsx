"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TAnalyticsAgentRow } from "@/types/analytics-overview.type";

import { topAgentsBarChartConfig } from "@/features/analytics/lib/analytics-chart-config";

type TTopAgentsBarChartProps = {
  agents: TAnalyticsAgentRow[];
};

export function TopAgentsBarChart({ agents }: TTopAgentsBarChartProps) {
  const chartData = agents.slice(0, 5).map((agent) => ({
    name: agent.name.split(" ")[0],
    quotations: agent.quotations,
  }));

  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">Top Agents</CardTitle>
        <CardDescription>
          Highest quotation volume by team member.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={topAgentsBarChartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 16 }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="quotations"
              fill="var(--color-chart-1)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
