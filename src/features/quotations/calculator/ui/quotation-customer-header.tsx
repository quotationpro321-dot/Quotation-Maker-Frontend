"use client";

import { Eye, PlusCircle, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TQuotationCustomerHeaderProps = {
  customerName: string;
  customerNumber: string;
  onCustomerNameChange: (value: string) => void;
  onCustomerNumberChange: (value: string) => void;
  onAddOption: () => void;
  onPreview: () => void;
  onSave: () => void;
};

export function QuotationCustomerHeader({
  customerName,
  customerNumber,
  onCustomerNameChange,
  onCustomerNumberChange,
  onAddOption,
  onPreview,
  onSave,
}: TQuotationCustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded! border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="grid flex-1 gap-3 sm:grid-cols-2">
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Customer name"
            className="rounded! pl-9"
          />
        </div>
        <Input
          value={customerNumber}
          onChange={(e) => onCustomerNumberChange(e.target.value)}
          placeholder="Customer number"
          className="rounded!"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" className="rounded!" onClick={onAddOption}>
          <PlusCircle className="size-4" />
          Add option
        </Button>
        <Button type="button" variant="outline" className="rounded!" onClick={onPreview}>
          <Eye className="size-4" />
          Preview
        </Button>
        <Button
          type="button"
          className="rounded! bg-brand-primary! text-white! hover:bg-brand-primary-700!"
          onClick={onSave}
        >
          <Save className="size-4" />
          Save quotation
        </Button>
      </div>
    </div>
  );
}
