"use client";

import { Hotel, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { SettingsHotelFormDialog } from "@/features/settings/ui/settings-hotel-form-dialog";
import {
  useDeleteHotelMutation,
  useListHotelsByAreaQuery,
  type THotelAreaDto,
  type THotelDto,
} from "@/redux/api/hotels.api";
import { cn } from "@/lib/utils";

type TSettingsAreaHotelsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: THotelAreaDto;
};

export function SettingsAreaHotelsDialog({
  open,
  onOpenChange,
  area,
}: TSettingsAreaHotelsDialogProps) {
  const { data, isLoading, isError, refetch } = useListHotelsByAreaQuery(
    { area: area.slug },
    { skip: !open },
  );
  const [deleteHotel, { isLoading: isDeleting }] = useDeleteHotelMutation();

  const [hotelFormOpen, setHotelFormOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<THotelDto | null>(null);

  const hotels = data?.data ?? [];

  useEffect(() => {
    if (open && isError) {
      toast.error(`Could not load hotels for ${area.name}.`);
    }
  }, [area.name, isError, open]);

  const openCreateHotel = () => {
    setEditingHotel(null);
    setHotelFormOpen(true);
  };

  const openEditHotel = (hotel: THotelDto) => {
    setEditingHotel(hotel);
    setHotelFormOpen(true);
  };

  const handleDeleteHotel = async (hotel: THotelDto) => {
    try {
      await deleteHotel(hotel.id).unwrap();
      toast.success("Hotel removed.");
      await refetch();
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not remove hotel."));
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[min(85vh,640px)] flex-col gap-0 overflow-hidden rounded! p-0 sm:max-w-lg">
          <DialogHeader className="space-y-1.5 border-b px-6 py-5 pr-12">
            <DialogTitle className="flex items-center gap-2">
              <Hotel className="size-4 text-brand-primary" aria-hidden />
              Hotels in {area.name}
            </DialogTitle>
            <DialogDescription>
              Manage hotels available under this area in the quotation calculator.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded!" />
                <Skeleton className="h-12 w-full rounded!" />
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Could not load hotels for this area.
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
            ) : hotels.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No hotels in this area yet. Add the first hotel below.
              </p>
            ) : (
              <ul className="space-y-3">
                {hotels.map((hotel) => (
                  <li
                    key={hotel.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded! border border-border bg-muted/15 px-4 py-3",
                      !hotel.isActive && "opacity-60",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{hotel.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[hotel.city, hotel.distance].filter(Boolean).join(" · ") ||
                          "No extra details"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded!"
                        disabled={isDeleting}
                        onClick={() => openEditHotel(hotel)}
                        aria-label={`Edit ${hotel.name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="rounded! text-destructive hover:text-destructive"
                        disabled={isDeleting || !hotel.isActive}
                        onClick={() => void handleDeleteHotel(hotel)}
                        aria-label={`Remove ${hotel.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter className="mt-0 -mx-0 -mb-0 gap-2 rounded-b! border-t bg-muted/50 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded!"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="button" className="rounded!" onClick={openCreateHotel}>
              <Plus className="size-4" />
              Add hotel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SettingsHotelFormDialog
        open={hotelFormOpen}
        onOpenChange={setHotelFormOpen}
        area={area}
        hotel={editingHotel}
      />
    </>
  );
}
