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
import type { TAnalyticsTrendPoint } from "@/types/analytics-overview.type";

import { revenueBarChartConfig } from "@/features/analytics/lib/analytics-chart-config";
import { formatCurrency } from "@/features/dashboard/lib/format-dashboard";

type TRevenueBarChartProps = {
  data: TAnalyticsTrendPoint[];
};

export function RevenueBarChart({ data }: TRevenueBarChartProps) {
  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">Revenue Trend</CardTitle>
        <CardDescription>
          Total quotation revenue by period bucket.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={revenueBarChartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart data={data} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                formatCurrency(value, "GBP").replace(/\u00a3/g, "")
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    formatCurrency(Number(value), "GBP")
                  }
                />
              }
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-chart-2)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
