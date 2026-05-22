"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { TAnalyticsStatusSlice } from "@/types/analytics-overview.type";

import {
  STATUS_CHART_COLORS,
  statusChartConfig,
} from "@/features/analytics/lib/analytics-chart-config";

type TQuotationStatusPieChartProps = {
  data: TAnalyticsStatusSlice[];
};

export function QuotationStatusPieChart({ data }: TQuotationStatusPieChartProps) {
  const chartData = data.map((slice) => ({
    status: slice.status,
    count: slice.count,
    fill: STATUS_CHART_COLORS[slice.status],
  }));

  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">
          Quotation Status
        </CardTitle>
        <CardDescription>Pipeline breakdown by current status.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={statusChartConfig}
          className="mx-auto aspect-square h-[300px] w-full max-w-[320px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="status" />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="status" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
