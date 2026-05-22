import Link from "next/link";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import type { TDashboardQuotationRow } from "@/types/dashboard-overview.type";

import { formatCurrency } from "@/features/dashboard/lib/format-dashboard";
import { QuotationStatusBadge } from "@/features/dashboard/ui/quotation-status-badge";

type TRecentQuotationsTableProps = {
  rows: TDashboardQuotationRow[];
  reportHref?: string;
  title?: string;
};

export function RecentQuotationsTable({
  rows,
  reportHref,
  title = "Recent Deals",
}: TRecentQuotationsTableProps) {
  return (
    <Card className="rounded! border-border shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardTitle className="text-lg text-brand-primary">{title}</CardTitle>
          <CardDescription>Latest quotation activity</CardDescription>
        </div>
        {reportHref && (
          <Button asChild variant="link" className="h-auto px-0 text-brand-primary">
            <Link href={reportHref}>Full report</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-0 pb-0">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 pb-6 pt-2 text-center text-muted-foreground">
            <FileText className="size-8 opacity-50" aria-hidden />
            <p className="text-sm">No quotations to show yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Reference</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-6 font-medium">
                      {row.reference}
                    </TableCell>
                    <TableCell>{row.clientName}</TableCell>
                    <TableCell>
                      <QuotationStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="pr-6 text-right font-semibold">
                      {formatCurrency(row.value, row.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
