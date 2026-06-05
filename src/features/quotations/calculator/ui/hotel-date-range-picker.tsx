"use client";

import { format, isValid, parse } from "date-fns";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DATE_FORMAT = "dd MMM yyyy";

function parseDisplayDate(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, DATE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

function formatDisplayDate(date: Date | undefined): string {
  return date ? format(date, DATE_FORMAT) : "";
}

function toDateRange(checkIn: string, checkOut: string): DateRange | undefined {
  const from = parseDisplayDate(checkIn);
  const to = parseDisplayDate(checkOut);
  if (!from && !to) return undefined;
  return { from, to };
}

type THotelStayDateRangeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkIn: string;
  checkOut: string;
  onApply: (checkIn: string, checkOut: string) => void;
};

export function HotelStayDateRangeDialog({
  open,
  onOpenChange,
  checkIn,
  checkOut,
  onApply,
}: THotelStayDateRangeDialogProps) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [monthCount, setMonthCount] = useState(2);

  useEffect(() => {
    if (!open) return;
    setRange(toDateRange(checkIn, checkOut));
  }, [open, checkIn, checkOut]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const updateMonthCount = () => setMonthCount(media.matches ? 2 : 1);
    updateMonthCount();
    media.addEventListener("change", updateMonthCount);
    return () => media.removeEventListener("change", updateMonthCount);
  }, []);

  const handleSelect = (selected: DateRange | undefined) => {
    setRange(selected);

    if (selected?.from && selected?.to) {
      onApply(formatDisplayDate(selected.from), formatDisplayDate(selected.to));
      onOpenChange(false);
    }
  };

  const handleClear = () => {
    setRange(undefined);
    onApply("", "");
  };

  const summary =
    range?.from && range?.to
      ? `${formatDisplayDate(range.from)} → ${formatDisplayDate(range.to)}`
      : range?.from
        ? `${formatDisplayDate(range.from)} — select check-out`
        : "Select check-in, then check-out";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded! p-0 sm:max-w-fit">
        <DialogHeader className="border-b border-border px-4 py-4 pr-12">
          <DialogTitle>Stay dates</DialogTitle>
          <DialogDescription>{summary}</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center overflow-x-auto p-4">
          <Calendar
            mode="range"
            numberOfMonths={monthCount}
            selected={range}
            onSelect={handleSelect}
            defaultMonth={range?.from ?? parseDisplayDate(checkIn) ?? new Date()}
            className="border-0 bg-transparent [--cell-size:2.5rem] md:[--cell-size:2.75rem]"
          />
        </div>

        <DialogFooter className="mx-0 mb-0 rounded-none border-t border-border bg-muted/50 px-4 py-3 sm:justify-between">
          <Button type="button" variant="outline" onClick={handleClear}>
            Clear dates
          </Button>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
