import { createEmptyCalculatorStates } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import type {
  TQuotationDetail,
  TQuotationDraft,
} from "@/types/quotation.type";

export function quotationDetailToDraft(detail: TQuotationDetail): TQuotationDraft {
  const calculatorType = detail.calculatorType ?? "umrah";

  const calculatorStates =
    detail.calculatorStates ??
    (() => {
      const states = createEmptyCalculatorStates();
      states[calculatorType] = {
        options: detail.options,
        activeOptionIndex: 0,
      };
      return states;
    })();

  return {
    id: detail.id,
    referenceNumber: detail.referenceNumber,
    customerName: detail.customerName,
    customerNumber: detail.customerNumber ?? detail.customerPhone ?? "",
    calculatorType,
    quotationDate: detail.quotationDate,
    status: detail.status,
    currency: detail.currency,
    templateId: detail.templateId,
    calculatorStates,
  };
}

export function prepareDraftForSave(draft: TQuotationDraft): TQuotationDraft {
  const { id: _id, referenceNumber: _ref, ...rest } = draft;
  return rest;
}

export function prepareDraftForClone(draft: TQuotationDraft): TQuotationDraft {
  const prepared = prepareDraftForSave(draft);
  return {
    ...prepared,
    status: "draft",
  };
}
