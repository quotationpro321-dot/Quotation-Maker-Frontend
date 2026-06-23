"use client";

import { Hotel, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { SettingsAreaHotelsDialog } from "@/features/settings/ui/settings-area-hotels-dialog";
import { SettingsHotelAreaFormDialog } from "@/features/settings/ui/settings-hotel-area-form-dialog";
import {
  useDeleteHotelAreaMutation,
  useListHotelAreasQuery,
  type TCalculatorCatalogType,
  type THotelAreaDto,
} from "@/redux/api/hotels.api";
import { cn } from "@/lib/utils";

type TSettingsHotelCatalogSectionProps = {
  calculatorType: TCalculatorCatalogType;
};

export function SettingsHotelCatalogSection({
  calculatorType,
}: TSettingsHotelCatalogSectionProps) {
  const { data, isLoading, isError, refetch } = useListHotelAreasQuery({
    calculatorType,
  });
  const [deleteArea, { isLoading: isDeletingArea }] = useDeleteHotelAreaMutation();

  const [areaFormOpen, setAreaFormOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<THotelAreaDto | null>(null);
  const [hotelsDialogArea, setHotelsDialogArea] = useState<THotelAreaDto | null>(
    null,
  );

  const areas = data?.data ?? [];

  useEffect(() => {
    if (isError) {
      toast.error("Could not load hotel areas.");
    }
  }, [isError]);

  const openCreateArea = () => {
    setEditingArea(null);
    setAreaFormOpen(true);
  };

  const openEditArea = (area: THotelAreaDto) => {
    setEditingArea(area);
    setAreaFormOpen(true);
  };

  const handleDeleteArea = async (area: THotelAreaDto) => {
    try {
      await deleteArea(area.id).unwrap();
      toast.success("Area removed.");
      if (hotelsDialogArea?.id === area.id) {
        setHotelsDialogArea(null);
      }
      await refetch();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not remove area."));
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">Hotel accommodation</h3>
          <p className="text-sm text-muted-foreground">
            Areas appear in the calculator location dropdown. Open an area to
            manage its hotels.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          className="rounded!"
          onClick={openCreateArea}
        >
          <Plus className="size-4" />
          Add area
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded!" />
          <Skeleton className="h-14 w-full rounded!" />
        </div>
      ) : isError ? (
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Could not load areas.</p>
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
      ) : areas.length === 0 ? (
        <p className="text-sm text-muted-foreground">No areas configured yet.</p>
      ) : (
        <ul className="space-y-2">
          {areas.map((area) => (
            <li
              key={area.id}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded! border border-border bg-muted/15 px-3 py-2.5",
                !area.isActive && "opacity-60",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{area.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Slug: {area.slug}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded!"
                  disabled={!area.isActive}
                  onClick={() => setHotelsDialogArea(area)}
                >
                  <Hotel className="size-4" />
                  Manage hotels
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded!"
                  disabled={isDeletingArea}
                  onClick={() => openEditArea(area)}
                  aria-label={`Edit ${area.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="rounded! text-destructive hover:text-destructive"
                  disabled={isDeletingArea || !area.isActive}
                  onClick={() => void handleDeleteArea(area)}
                  aria-label={`Remove ${area.name}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SettingsHotelAreaFormDialog
        open={areaFormOpen}
        onOpenChange={setAreaFormOpen}
        calculatorType={calculatorType}
        area={editingArea}
      />

      {hotelsDialogArea ? (
        <SettingsAreaHotelsDialog
          open
          onOpenChange={(open) => {
            if (!open) setHotelsDialogArea(null);
          }}
          area={hotelsDialogArea}
        />
      ) : null}
    </section>
  );
}
