"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { SettingsTransferLocationFormDialog } from "@/features/settings/ui/settings-transfer-location-form-dialog";
import type { TCalculatorCatalogType } from "@/redux/api/hotels.api";
import {
  useDeleteTransferLocationMutation,
  useListTransferLocationsQuery,
  type TTransferLocationDto,
} from "@/redux/api/transfer.api";
import { cn } from "@/lib/utils";

type TSettingsTransferCatalogSectionProps = {
  calculatorType: TCalculatorCatalogType;
};

export function SettingsTransferCatalogSection({
  calculatorType,
}: TSettingsTransferCatalogSectionProps) {
  const { data, isLoading, isError, refetch } = useListTransferLocationsQuery({
    calculatorType,
  });
  const [deleteLocation, { isLoading: isDeleting }] =
    useDeleteTransferLocationMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] =
    useState<TTransferLocationDto | null>(null);

  const locations = data?.data ?? [];

  useEffect(() => {
    if (isError) {
      toast.error("Could not load transfer locations.");
    }
  }, [isError]);

  const openCreate = () => {
    setEditingLocation(null);
    setFormOpen(true);
  };

  const openEdit = (location: TTransferLocationDto) => {
    setEditingLocation(location);
    setFormOpen(true);
  };

  const handleDelete = async (location: TTransferLocationDto) => {
    try {
      await deleteLocation(location.id).unwrap();
      toast.success("Transfer location removed.");
      await refetch();
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Could not remove transfer location."),
      );
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Transfer routes</h3>
          <p className="text-sm text-muted-foreground">
            From and To dropdowns in the calculator use these location names.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="rounded!"
          onClick={openCreate}
        >
          <Plus className="size-4" />
          Add location
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full rounded!" />
          <Skeleton className="h-12 w-full rounded!" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Could not load transfer locations.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded!"
            onClick={() => void refetch()}
          >
            Retry
          </Button>
        </div>
      ) : locations.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No transfer locations configured yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {locations.map((location) => (
            <li
              key={location.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded! border border-border bg-muted/15 px-3 py-2.5",
                !location.isActive && "opacity-60",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{location.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Slug: {location.slug}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded!"
                  disabled={isDeleting}
                  onClick={() => openEdit(location)}
                  aria-label={`Edit ${location.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded! text-destructive hover:text-destructive"
                  disabled={isDeleting || !location.isActive}
                  onClick={() => void handleDelete(location)}
                  aria-label={`Remove ${location.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SettingsTransferLocationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        calculatorType={calculatorType}
        location={editingLocation}
      />
    </section>
  );
}
