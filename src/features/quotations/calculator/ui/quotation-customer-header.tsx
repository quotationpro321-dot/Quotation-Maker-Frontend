"use client";

import { Eye, PlusCircle, Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUOTATION_TEMPLATES } from "@/features/quotations/calculator/lib/quotation-template-registry";
import type { TQuotationTemplateId } from "@/types/quotation.type";

type TQuotationCustomerHeaderProps = {
  customerName: string;
  customerNumber: string;
  templateId: TQuotationTemplateId;
  onCustomerNameChange: (value: string) => void;
  onCustomerNumberChange: (value: string) => void;
  onTemplateChange: (templateId: TQuotationTemplateId) => void;
  onAddOption: () => void;
  onPreview: () => void;
  onSave: () => void;
};

export function QuotationCustomerHeader({
  customerName,
  customerNumber,
  templateId,
  onCustomerNameChange,
  onCustomerNumberChange,
  onTemplateChange,
  onAddOption,
  onPreview,
  onSave,
}: TQuotationCustomerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded! border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-[minmax(0,340px)_minmax(0,340px)]">
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
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={templateId}
          onValueChange={(value) =>
            onTemplateChange(value as TQuotationTemplateId)
          }
        >
          <SelectTrigger className="h-10! min-w-[180px] rounded!">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            {QUOTATION_TEMPLATES.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
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
          className="h-10 rounded! bg-brand-primary! text-white! hover:bg-brand-primary-700!"
          onClick={onSave}
        >
          <Save className="size-4" />
          Save quotation
        </Button>
      </div>
    </div>
  );
}
