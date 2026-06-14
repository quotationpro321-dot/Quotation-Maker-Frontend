import type { TQuotationOption } from "@/types/quotation.type";

export function hasExportableCustomerNote(option: TQuotationOption): boolean {
  return (
    option.customerNoteSectionEnabled && option.customerNote.trim().length > 0
  );
}
