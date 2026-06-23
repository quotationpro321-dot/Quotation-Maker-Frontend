"use client";

import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import {
  useCreateHotelMutation,
  useUpdateHotelMutation,
  type THotelAreaDto,
  type THotelDto,
} from "@/redux/api/hotels.api";

type TSettingsHotelFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  area: THotelAreaDto;
  hotel?: THotelDto | null;
};

export function SettingsHotelFormDialog({
  open,
  onOpenChange,
  area,
  hotel,
}: TSettingsHotelFormDialogProps) {
  const isEdit = Boolean(hotel);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [distance, setDistance] = useState("");
  const [createHotel, { isLoading: isCreating }] = useCreateHotelMutation();
  const [updateHotel, { isLoading: isUpdating }] = useUpdateHotelMutation();
  const busy = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setName(hotel?.name ?? "");
      setCity(hotel?.city ?? "");
      setDistance(hotel?.distance ?? "");
    }
  }, [hotel, open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Hotel name is required.");
      return;
    }

    try {
      if (isEdit && hotel) {
        await updateHotel({
          id: hotel.id,
          name: trimmedName,
          city: city.trim(),
          distance: distance.trim(),
        }).unwrap();
        toast.success("Hotel updated.");
      } else {
        await createHotel({
          areaId: area.id,
          name: trimmedName,
          city: city.trim(),
          distance: distance.trim(),
        }).unwrap();
        toast.success("Hotel added.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not save hotel."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded! p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit hotel" : "Add hotel"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update hotel details for ${area.name}.`
              : `Add a hotel to ${area.name}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotel-name">Hotel name</Label>
            <Input
              id="hotel-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Swissotel Makkah"
              className="h-10 rounded!"
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel-city">City</Label>
            <Input
              id="hotel-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Optional"
              className="h-10 rounded!"
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hotel-distance">Distance</Label>
            <Input
              id="hotel-distance"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              placeholder="e.g. 300m from Haram"
              className="h-10 rounded!"
              disabled={busy}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleSave();
              }}
            />
          </div>
        </div>

        <DialogFooter className="-mx-6 -mb-6 mt-1 rounded-b!">
          <Button
            type="button"
            variant="outline"
            className="rounded!"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded!"
            disabled={busy}
            onClick={() => void handleSave()}
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {isEdit ? "Save changes" : "Add hotel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
