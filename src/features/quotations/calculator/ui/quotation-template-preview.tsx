"use client";

import { useQuotationConsultantName } from "@/features/quotations/calculator/hooks/use-quotation-consultant-name";
import { calculateOptionTotals } from "@/features/quotations/calculator/lib/calculate-quotation";
import { getCalculatorTypeState } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import { getQuotationTemplate } from "@/features/quotations/calculator/lib/quotation-template-registry";
import { QuotationPagedPreviewScaler } from "@/features/quotations/calculator/ui/quotation-paged-preview-scaler";
import type { TQuotationDraft } from "@/types/quotation.type";
import { cn } from "@/lib/utils";

type TQuotationTemplatePreviewProps = {
  draft: TQuotationDraft;
  activeOptionIndex: number;
  previewRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  /** Embedded in share links; when omitted, fetched from dashboard profile API. */
  consultantName?: string;
  consultantWhatsapp?: string;
  consultantDesignation?: string;
};

/** Templates rendered as fixed A4 pages need the paged scaler in the preview. */
function isPagedClassicPreview(draft: TQuotationDraft): boolean {
  if (draft.templateId !== "classic") return false;
  return draft.calculatorType === "umrah" || draft.calculatorType === "holiday" || draft.calculatorType === "flights";
}

export function QuotationTemplatePreview({
  draft,
  activeOptionIndex,
  previewRef,
  className,
  consultantName: consultantNameProp,
  consultantWhatsapp: consultantWhatsappProp,
  consultantDesignation: consultantDesignationProp,
}: TQuotationTemplatePreviewProps) {
  const {
    consultantName: fetchedConsultantName,
    consultantWhatsapp: fetchedConsultantWhatsapp,
    consultantDesignation: fetchedConsultantDesignation,
  } = useQuotationConsultantName();
  const consultantName = consultantNameProp ?? fetchedConsultantName;
  const consultantWhatsapp = consultantWhatsappProp ?? fetchedConsultantWhatsapp;
  const consultantDesignation =
    consultantDesignationProp ?? fetchedConsultantDesignation;
  const activeCalculatorOptions = getCalculatorTypeState(draft).options;
  const activeOption =
    activeCalculatorOptions[activeOptionIndex] ?? activeCalculatorOptions[0];
  const template = getQuotationTemplate(draft.templateId);
  const TemplateComponent = template?.component;
  const totals = calculateOptionTotals(activeOption, draft.calculatorType);
  const usePagedPreview = isPagedClassicPreview(draft);

  if (!TemplateComponent || !activeOption) {
    return (
      <p className="text-sm text-muted-foreground">
        Quotation preview is unavailable for this template.
      </p>
    );
  }

  const templatePreview = (
    <TemplateComponent
      draft={draft}
      option={activeOption}
      optionIndex={activeOptionIndex}
      totals={totals}
      currency={draft.currency}
      consultantName={consultantName}
      consultantWhatsapp={consultantWhatsapp}
      consultantDesignation={consultantDesignation}
    />
  );

  return (
    <div
      ref={previewRef}
      className={cn(
        usePagedPreview
          ? "flex min-w-0 justify-center py-2"
          : "rounded! border border-border bg-muted/20 p-4",
        className,
      )}
    >
      {usePagedPreview ? (
        <QuotationPagedPreviewScaler>{templatePreview}</QuotationPagedPreviewScaler>
      ) : (
        templatePreview
      )}
    </div>
  );
}
