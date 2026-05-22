"use client";

import { FileText, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TQuotationOption } from "@/types/quotation.type";

type TQuotationNotesSectionProps = {
  option: TQuotationOption;
  onChange: (patch: Partial<TQuotationOption>) => void;
};

export function QuotationNotesSection({
  option,
  onChange,
}: TQuotationNotesSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded!">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Info className="size-4" />
            Office note (internal)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="office-note" className="sr-only">
            Office note
          </Label>
          <Textarea
            id="office-note"
            value={option.officeNote}
            onChange={(e) => onChange({ officeNote: e.target.value })}
            placeholder="Private notes for the office…"
            className="min-h-32 rounded!"
          />
          <p className="text-xs text-muted-foreground">
            Not included in customer export.
          </p>
        </CardContent>
      </Card>
      <Card className="rounded!">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="size-4" />
            Customer note (external)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="customer-note" className="sr-only">
            Customer note
          </Label>
          <Textarea
            id="customer-note"
            value={option.customerNote}
            onChange={(e) => onChange({ customerNote: e.target.value })}
            placeholder="Notes visible to the customer…"
            className="min-h-32 rounded!"
          />
          <p className="text-xs text-muted-foreground">
            Included in preview and PDF export.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
