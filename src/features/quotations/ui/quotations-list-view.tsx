"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import {
  useQuotationsTable,
  type TQuotationsScope,
} from "@/features/quotations/hooks/use-quotations-table";
import {
  prepareDraftForClone,
  quotationDetailToDraft,
} from "@/features/quotations/lib/quotation-api-mapper";
import { getQuotationEditPath, getQuotationPaths, getNewQuotationPath } from "@/features/quotations/lib/quotation-paths";
import { DeleteQuotationDialog } from "@/features/quotations/ui/delete-quotation-dialog";
import { QuotationViewDialog } from "@/features/quotations/ui/quotation-view-dialog";
import { QuotationsLoadingSkeleton } from "@/features/quotations/ui/quotations-loading-skeleton";
import { QuotationsTableToolbar } from "@/features/quotations/ui/quotations-table-toolbar";
import {
  useCreateQuotationMutation,
  useDeleteQuotationMutation,
  useLazyGetQuotationDetailQuery,
} from "@/redux/api/quotations.api";
import type { TQuotationListItem, TQuotationStatus } from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";

function useDebouncedValue<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

type TQuotationsListViewProps = {
  scope: TQuotationsScope;
  role: UserRole;
  title: string;
  subtitle: string;
};

export function QuotationsListView({
  scope,
  role,
  title,
  subtitle,
}: TQuotationsListViewProps) {
  const router = useRouter();
  const paths = getQuotationPaths(role);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [statusFilter, setStatusFilter] = useState<TQuotationStatus | "all">("all");
  const [viewTarget, setViewTarget] = useState<TQuotationListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TQuotationListItem | null>(null);

  const [deleteQuotation] = useDeleteQuotationMutation();
  const [createQuotation] = useCreateQuotationMutation();
  const [fetchQuotationDetail] = useLazyGetQuotationDetailQuery();

  const handleView = useCallback((quotation: TQuotationListItem) => {
    setViewTarget(quotation);
  }, []);

  const handleEdit = useCallback((_quotation: TQuotationListItem) => {
    // Navigation handled by row action link.
  }, []);

  const handleDuplicate = useCallback(
    async (quotation: TQuotationListItem) => {
      const toastId = toast.loading("Duplicating quotation…");

      try {
        const detailResponse = await fetchQuotationDetail(quotation.id).unwrap();
        const clonedDraft = prepareDraftForClone(
          quotationDetailToDraft(detailResponse.data),
        );
        const createdResponse = await createQuotation(clonedDraft).unwrap();
        toast.success("Quotation duplicated.", { id: toastId });
        router.push(getQuotationEditPath(role, createdResponse.data.id));
      } catch (error) {
        toast.error(extractApiErrorMessage(error, "Could not duplicate quotation."), {
          id: toastId,
        });
      }
    },
    [createQuotation, fetchQuotationDetail, role, router],
  );

  const handleDelete = useCallback((quotation: TQuotationListItem) => {
    setDeleteTarget(quotation);
  }, []);

  const {
    table,
    totalRows,
    isLoading,
    isFetching,
    isError,
    resetPage,
  } = useQuotationsTable({
    scope,
    role,
    search: debouncedSearch,
    statusFilter: statusFilter === "all" ? undefined : statusFilter,
    onView: handleView,
    onEdit: handleEdit,
    onDuplicate: (quotation) => void handleDuplicate(quotation),
    onDelete: handleDelete,
  });

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, statusFilter, resetPage]);

  if (isLoading) return <QuotationsLoadingSkeleton />;

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        Unable to load quotations. Please try again later.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        </div>
        <Button
          asChild
          className="rounded! border-transparent bg-brand-primary! font-medium text-white! hover:bg-brand-primary-700!"
        >
          <Link href={getNewQuotationPath(role)}>
            <Plus className="size-4" aria-hidden />
            New Quotation
          </Link>
        </Button>
      </div>

      <div className="space-y-4 rounded! border border-border bg-card p-4 shadow-sm">
        <QuotationsTableToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {isFetching ? (
          <p className="text-xs text-muted-foreground">Refreshing…</p>
        ) : null}

        <DataTable
          table={table}
          emptyMessage="No quotations found."
          className="rounded!"
        />
        <DataTablePagination table={table} totalRows={totalRows} />
      </div>

      <QuotationViewDialog
        quotation={viewTarget}
        role={role}
        open={Boolean(viewTarget)}
        onOpenChange={(open) => {
          if (!open) setViewTarget(null);
        }}
      />

      <DeleteQuotationDialog
        quotation={deleteTarget}
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirmDelete={async (quotation) => {
          await deleteQuotation(quotation.id).unwrap();
        }}
      />
    </div>
  );
}
