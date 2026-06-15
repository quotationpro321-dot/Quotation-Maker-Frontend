import { UMRAH_PDF_TEAL } from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";
import { hasExportableCustomerNote } from "@/features/quotations/calculator/lib/quotation-customer-note";
import type { TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahPageShell } from "./classic-umrah-page-shell";

type TClassicUmrahOptionCustomerNotePageProps = {
  option: TQuotationOption;
  optionNumber: number;
};

export function ClassicUmrahOptionCustomerNotePage({
  option,
  optionNumber,
}: TClassicUmrahOptionCustomerNotePageProps) {
  if (!hasExportableCustomerNote(option)) return null;

  return (
    <ClassicUmrahPageShell>
      <h2 className="text-center text-[16px] font-bold">Option- {optionNumber}</h2>
      <h2 className="pb-4 text-center text-[16px] font-bold">CUSTOMER NOTES</h2>

      <div
        className="px-3 py-1.5 text-center text-[14px] font-bold text-white"
        style={{ backgroundColor: UMRAH_PDF_TEAL }}
      >
        Important information
      </div>
      <div className="border border-t-0 border-slate-900 px-4 py-4 text-[12.5px] leading-relaxed text-slate-900">
        <p className="whitespace-pre-line">{option.customerNote.trim()}</p>
      </div>
    </ClassicUmrahPageShell>
  );
}
