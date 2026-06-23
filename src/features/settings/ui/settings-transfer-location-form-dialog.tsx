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
import type { TCalculatorCatalogType } from "@/redux/api/hotels.api";
import {
  useCreateTransferLocationMutation,
  useUpdateTransferLocationMutation,
  type TTransferLocationDto,
} from "@/redux/api/transfer.api";

type TSettingsTransferLocationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calculatorType: TCalculatorCatalogType;
  location?: TTransferLocationDto | null;
};

export function SettingsTransferLocationFormDialog({
  open,
  onOpenChange,
  calculatorType,
  location,
}: TSettingsTransferLocationFormDialogProps) {
  const isEdit = Boolean(location);
  const [name, setName] = useState("");
  const [createLocation, { isLoading: isCreating }] =
    useCreateTransferLocationMutation();
  const [updateLocation, { isLoading: isUpdating }] =
    useUpdateTransferLocationMutation();
  const busy = isCreating || isUpdating;

  useEffect(() => {
    if (open) {
      setName(location?.name ?? "");
    }
  }, [location, open]);

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Location name is required.");
      return;
    }

    try {
      if (isEdit && location) {
        await updateLocation({ id: location.id, name: trimmedName }).unwrap();
        toast.success("Transfer location updated.");
      } else {
        await createLocation({ name: trimmedName, calculatorType }).unwrap();
        toast.success("Transfer location added.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(
        extractApiErrorMessage(error, "Could not save transfer location."),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded! p-6 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit transfer location" : "Add transfer location"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the location name used in From and To route dropdowns."
              : "Create a new transfer route endpoint for this calculator type."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="transfer-location-name">Location name</Label>
          <Input
            id="transfer-location-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Jeddah Airport"
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
            {isEdit ? "Save changes" : "Add location"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
