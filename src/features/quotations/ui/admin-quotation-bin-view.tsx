"use client";

import { Info, Search } from "lucide-react";
import { useCallback, useState } from "react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useQuotationBin } from "@/features/quotations/hooks/use-quotation-bin";
import { QuotationsLoadingSkeleton } from "@/features/quotations/ui/quotations-loading-skeleton";
import { RestoreQuotationDialog } from "@/features/quotations/ui/restore-quotation-dialog";
import type { TQuotationListItem } from "@/types/quotation.type";

export function AdminQuotationBinView() {
  const [search, setSearch] = useState("");
  const [restoreTarget, setRestoreTarget] =
    useState<TQuotationListItem | null>(null);
  const handleRestore = useCallback((quotation: TQuotationListItem) => {
    setRestoreTarget(quotation);
  }, []);
  const bin = useQuotationBin({ search, onRestore: handleRestore });

  if (bin.isLoading) return <QuotationsLoadingSkeleton />;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Quotation Bin
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Restore deleted quotations before they are permanently removed.
        </p>
      </header>

      <div
        role="alert"
        className="flex gap-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100"
      >
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          Deleted quotations stay here for 60 days. After that, they are
          permanently deleted automatically and cannot be restored.
        </p>
      </div>

      <div className="space-y-4 rounded! border border-border bg-card p-4 shadow-sm">
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference or customer…"
            className="h-10 rounded! pl-9"
          />
        </div>

        {bin.isFetching ? (
          <p className="text-xs text-muted-foreground">Refreshing…</p>
        ) : null}
        {bin.isError ? (
          <p className="text-sm text-destructive">
            Unable to load deleted quotations. Please try again.
          </p>
        ) : (
          <>
            <DataTable
              table={bin.table}
              emptyMessage="The quotation bin is empty."
              className="rounded!"
            />
            <DataTablePagination table={bin.table} totalRows={bin.totalRows} />
          </>
        )}
      </div>

      <RestoreQuotationDialog
        quotation={restoreTarget}
        open={Boolean(restoreTarget)}
        onOpenChange={(open) => {
          if (!open) setRestoreTarget(null);
        }}
      />
    </div>
  );
}
