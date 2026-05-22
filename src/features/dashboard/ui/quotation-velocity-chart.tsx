"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import type { TQuotationTrendPoint } from "@/types/dashboard-overview.type";

const chartConfig = {
  quotations: {
    label: "Quotations",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

type TChartPeriod = "weekly" | "monthly";

type TQuotationVelocityChartProps = {
  weeklyData: TQuotationTrendPoint[];
  monthlyData: TQuotationTrendPoint[];
  title?: string;
  description?: string;
};

export function QuotationVelocityChart({
  weeklyData,
  monthlyData,
  title = "Quotation Velocity",
  description = "Volume analysis for the selected period.",
}: TQuotationVelocityChartProps) {
  const [period, setPeriod] = useState<TChartPeriod>("weekly");

  const chartData = useMemo(
    () => (period === "weekly" ? weeklyData : monthlyData),
    [monthlyData, period, weeklyData],
  );

  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg text-brand-primary">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="inline-flex rounded! border border-border bg-muted/40 p-1">
          {(["weekly", "monthly"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value)}
              className={cn(
                "rounded! px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                period === value
                  ? "bg-card text-brand-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="quotationFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="quotations"
              stroke="var(--color-chart-1)"
              fill="url(#quotationFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
