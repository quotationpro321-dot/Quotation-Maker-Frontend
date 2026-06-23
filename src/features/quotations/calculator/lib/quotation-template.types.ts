import type { TQuotationDraft, TQuotationOption } from "@/types/quotation.type";

import type { TOptionTotals } from "./calculate-quotation";

export type TQuotationTemplateProps = {
  draft: TQuotationDraft;
  option: TQuotationOption;
  optionIndex: number;
  totals: TOptionTotals;
  currency: string;
  /** Logged-in user's full name for the PDF footer (from dashboard profile). */
  consultantName?: string;
  /** Logged-in user's WhatsApp number for the PDF footer (from dashboard profile). */
  consultantWhatsapp?: string;
  /** Logged-in user's job title for the PDF footer (from dashboard profile). */
  consultantDesignation?: string;
};
