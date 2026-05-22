import type { TQuotationDraft, TQuotationOption } from "@/types/quotation.type";

import type { TOptionTotals } from "./calculate-quotation";

export type TQuotationTemplateProps = {
  draft: TQuotationDraft;
  option: TQuotationOption;
  optionIndex: number;
  totals: TOptionTotals;
  currency: string;
};
