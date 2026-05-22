"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TQuotationStatus } from "@/types/quotation.type";
import { cn } from "@/lib/utils";

type TQuotationsTableToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TQuotationStatus | "all";
  onStatusFilterChange: (value: TQuotationStatus | "all") => void;
};

const toolbarControlClassName =
  "!h-10 min-h-10 rounded border-input bg-muted/40 py-0 text-sm dark:bg-input/30";

const toolbarSelectTriggerClassName = cn(
  toolbarControlClassName,
  "w-full px-3 sm:w-[160px]",
  "!h-10 data-[size=default]:!h-10 data-[size=sm]:!h-10",
);

export function QuotationsTableToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: TQuotationsTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative max-w-sm flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customer, hotel, or agent…"
          className={cn(toolbarControlClassName, "pl-9")}
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={(value) =>
          onStatusFilterChange(value as TQuotationStatus | "all")
        }
      >
        <SelectTrigger className={toolbarSelectTriggerClassName}>
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
