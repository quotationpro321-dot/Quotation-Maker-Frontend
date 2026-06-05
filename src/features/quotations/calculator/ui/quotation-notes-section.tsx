"use client";

import { FileText, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  QuotationSectionHeader,
  quotationSectionBodyClass,
} from "@/features/quotations/calculator/ui/quotation-section-header";
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
        <QuotationSectionHeader
          icon={<Info className="size-4" />}
          title="Office note (internal)"
          enabled={option.officeNoteSectionEnabled}
          onEnabledChange={(officeNoteSectionEnabled) =>
            onChange({ officeNoteSectionEnabled })
          }
        />
        <CardContent
          className={`space-y-2 ${quotationSectionBodyClass(option.officeNoteSectionEnabled)}`}
        >
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
        <QuotationSectionHeader
          icon={<FileText className="size-4" />}
          title="Customer note (external)"
          enabled={option.customerNoteSectionEnabled}
          onEnabledChange={(customerNoteSectionEnabled) =>
            onChange({ customerNoteSectionEnabled })
          }
        />
        <CardContent
          className={`space-y-2 ${quotationSectionBodyClass(option.customerNoteSectionEnabled)}`}
        >
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
