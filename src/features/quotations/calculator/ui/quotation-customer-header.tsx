"use client";

import { Eye, Mail, PlusCircle, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  QUOTATION_CUSTOMER_SOURCES,
  type TQuotationCustomerSource,
} from "@/features/quotations/lib/quotation-customer-source";
import { cn } from "@/lib/utils";

type TQuotationCustomerHeaderProps = {
  customerName: string;
  customerNumber: string;
  customerEmail: string;
  customerSource: TQuotationCustomerSource | "";
  onCustomerNameChange: (value: string) => void;
  onCustomerNumberChange: (value: string) => void;
  onCustomerEmailChange: (value: string) => void;
  onCustomerSourceChange: (value: TQuotationCustomerSource | "") => void;
  onAddOption: () => void;
  onPreview: () => void;
  onSave: () => void | Promise<void>;
  isSaving?: boolean;
};

export function QuotationCustomerHeader({
  customerName,
  customerNumber,
  customerEmail,
  customerSource,
  onCustomerNameChange,
  onCustomerNumberChange,
  onCustomerEmailChange,
  onCustomerSourceChange,
  onAddOption,
  onPreview,
  onSave,
  isSaving = false,
}: TQuotationCustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded! border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-[minmax(0,200px)_minmax(0,200px)_minmax(0,260px)]">
        <div className="relative">
          <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Customer name"
            className="h-10 rounded! pl-9"
          />
        </div>
        <Input
          value={customerNumber}
          onChange={(e) => onCustomerNumberChange(e.target.value)}
          placeholder="Customer number"
          className="h-10 rounded!"
        />
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            value={customerEmail}
            onChange={(e) => onCustomerEmailChange(e.target.value)}
            placeholder="email address"
            className="h-10 rounded! pl-9"
            autoComplete="email"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={customerSource || undefined}
          onValueChange={(value) =>
            onCustomerSourceChange(value as TQuotationCustomerSource)
          }
        >
          <SelectTrigger className="h-10! min-w-[200px] rounded!">
            <SelectValue placeholder="Customer source" />
          </SelectTrigger>
          <SelectContent>
            {QUOTATION_CUSTOMER_SOURCES.map((source) => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded!"
          onClick={onAddOption}
        >
          <PlusCircle className="size-4" />
          Add option
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded!"
          onClick={onPreview}
        >
          <Eye className="size-4" />
          Preview
        </Button>
        <Button
          type="button"
          className={cn(
            "h-10 min-w-36 rounded! bg-brand-primary! text-white! hover:bg-brand-primary-700! disabled:hover:bg-brand-primary!",
            isSaving && "disabled:opacity-100",
          )}
          onClick={() => void onSave()}
          disabled={isSaving}
          aria-busy={isSaving}
        >
          {isSaving ? (
            <>
              <Spinner className="text-white" />
              Saving…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save quotation
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
