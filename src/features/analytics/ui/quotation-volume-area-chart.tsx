"use client";

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
} from "@/components/ui/chart";
import type { TAnalyticsTrendPoint } from "@/types/analytics-overview.type";

import { quotationVolumeChartConfig } from "@/features/analytics/lib/analytics-chart-config";

type TQuotationVolumeAreaChartProps = {
  data: TAnalyticsTrendPoint[];
};

export function QuotationVolumeAreaChart({ data }: TQuotationVolumeAreaChartProps) {
  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-brand-primary">
          Quotation Volume
        </CardTitle>
        <CardDescription>
          Number of quotations created over the selected period.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={quotationVolumeChartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={data} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="quotationVolumeFill" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#quotationVolumeFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
