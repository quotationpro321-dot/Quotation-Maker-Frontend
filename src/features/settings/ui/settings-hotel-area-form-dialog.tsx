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
  useCreateHotelAreaMutation,
  useUpdateHotelAreaMutation,
  type TCalculatorCatalogType,
  type THotelAreaDto,
} from "@/redux/api/hotels.api";

type TSettingsHotelAreaFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculatorType: TCalculatorCatalogType;
  area?: THotelAreaDto | null;
};

export function SettingsHotelAreaFormDialog({
  open,
  onOpenChange,
  calculatorType,
  area,
}: TSettingsHotelAreaFormDialogProps) {
  const isEdit = Boolean(area);
  const [name, setName] = useState("");
  const [createArea, { isLoading: isCreating }] = useCreateHotelAreaMutation();
  const [updateArea, { isLoading: isUpdating }] = useUpdateHotelAreaMutation();
  const busy = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setName(area?.name ?? "");
    }
  }, [area, open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Area name is required.");
      return;
    }

    try {
      if (isEdit && area) {
        await updateArea({ id: area.id, name: trimmedName }).unwrap();
        toast.success("Area updated.");
      } else {
        await createArea({ name: trimmedName, calculatorType }).unwrap();
        toast.success("Area added.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(extractApiErrorMessage(error, "Could not save area."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded! p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit area" : "Add area"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the area name shown in the calculator location dropdown."
              : "Create a new hotel area for this calculator type."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="hotel-area-name">Area name</Label>
          <Input
            id="hotel-area-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Makkah"
            className="h-10 rounded!"
            disabled={busy}
            onKeyDown={(event) => {
              if (event.key === "Enter") void handleSave();
            }}
          />
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
            {isEdit ? "Save changes" : "Add area"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
