"use client";

import { Info, Plane, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { TimeFormat } from "@/features/flight-converter/types/flight-converter.types";

type PnrInputPanelProps = {
  rawText: string;
  onRawTextChange: (value: string) => void;
  timeFormat: TimeFormat;
  onTimeFormatChange: (value: TimeFormat) => void;
  isLoading: boolean;
  onConvert: () => void;
  onClear: () => void;
  onLoadExample: (example: "qr" | "bg" | "ek" | "sv") => void;
};

export function PnrInputPanel({
  rawText,
  onRawTextChange,
  timeFormat,
  onTimeFormatChange,
  isLoading,
  onConvert,
  onClear,
  onLoadExample,
}: PnrInputPanelProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight md:text-3xl">
            <Plane className="size-7 text-brand-primary" />
            Flight Converter
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Convert Amadeus GDS text into a professional client-ready itinerary.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded!"
            onClick={() => onLoadExample("qr")}
          >
            <Info className="size-4" />
            QR Example
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded!"
            onClick={() => onLoadExample("bg")}
          >
            <Info className="size-4" />
            BG Example
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded!"
            onClick={() => onLoadExample("ek")}
          >
            <Info className="size-4" />
            EK Example
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded!"
            onClick={() => onLoadExample("sv")}
          >
            <Info className="size-4" />
            SV Example
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded!"
            onClick={onClear}
            title="Clear input"
            aria-label="Clear input"
          >
            <Trash2 className="size-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pnr-input">PNR / GDS itinerary</Label>
        <Textarea
          id="pnr-input"
          className="min-h-48 rounded! font-mono text-sm md:min-h-56"
          placeholder="Paste Amadeus itinerary text here..."
          value={rawText}
          onChange={(e) => onRawTextChange(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full space-y-1.5 sm:max-w-[180px]">
          <Label>Time format</Label>
          <Select value={timeFormat} onValueChange={(v) => onTimeFormatChange(v as TimeFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24-hour</SelectItem>
              <SelectItem value="12h">12-hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          className="rounded! border-transparent bg-brand-primary! font-medium text-white! shadow-sm hover:bg-brand-primary-700! hover:text-white! focus-visible:ring-brand-primary/35 disabled:hover:bg-brand-primary!"
          onClick={onConvert}
          disabled={isLoading || !rawText.trim()}
        >
          {isLoading ? "Converting…" : "Convert"}
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      )}
    </section>
  );
}
