import { calculateTotalQuoteValue } from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  HOLIDAY_BANK_DETAILS,
  HOLIDAY_CANCELLATION_ROWS,
  HOLIDAY_DEPOSIT_ROWS,
  HOLIDAY_PDF_RED,
  HOLIDAY_TAX_NOTE,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";
import { formatHolidayWholeMoney } from "@/features/quotations/calculator/lib/quotation-holiday-summary";
import type { TQuotationOption } from "@/types/quotation.type";

import { HolidaySkyguruContactFooter } from "./holiday-skyguru-contact-footer";
import { HolidaySkyguruPageShell } from "./holiday-skyguru-page-shell";
import { HolidaySectionHeading } from "./holiday-skyguru-primitives";

export function HolidaySkyguruFinalPage({
  option,
  currency,
  consultantName,
  consultantWhatsapp,
  consultantDesignation,
}: {
  option: TQuotationOption;
  currency: string;
  consultantName: string;
  consultantWhatsapp: string;
  consultantDesignation: string;
}) {
  const totalQuoteValue = calculateTotalQuoteValue(option, "holiday");
  const zero = formatHolidayWholeMoney(0, currency);

  return (
    <HolidaySkyguruPageShell hideFooterStrip>
      <div>
        <HolidaySectionHeading>Payment Plan</HolidaySectionHeading>
        {HOLIDAY_DEPOSIT_ROWS.map((label) => (
          <div
            key={label}
            className="flex border border-t-0 border-slate-300 text-[12.5px]"
          >
            <div className="w-[130px] border-r border-slate-300 px-2 py-1">
              {label}
            </div>
            <div className="w-[130px] border-r border-slate-300 px-2 py-1 text-center">
              <span className="rounded bg-slate-100 px-2">—</span>
            </div>
            <div className="flex-1 border-r border-slate-300 px-2 py-1">
              {zero} PP x 0
            </div>
            <div className="w-[150px] px-2 py-1">{zero}</div>
          </div>
        ))}
        <div className="flex border border-t-0 border-slate-300 text-[12.5px] font-bold">
          <div className="flex-1 border-r border-slate-300 px-2 py-1 text-right">
            Total Quote Value
          </div>
          <div className="w-[150px] px-2 py-1 text-right">
            {formatHolidayWholeMoney(totalQuoteValue, currency)}
          </div>
        </div>
        <div className="space-y-0.5 border border-t-0 border-slate-300 px-3 py-2 text-center text-[12.5px]">
          <p className="font-bold">{HOLIDAY_BANK_DETAILS.title}</p>
          <p>{HOLIDAY_BANK_DETAILS.companyName}</p>
          <p>{HOLIDAY_BANK_DETAILS.accountNumber}</p>
          <p>{HOLIDAY_BANK_DETAILS.sortCode}</p>
          <p>{HOLIDAY_BANK_DETAILS.paymentRef}</p>
        </div>
      </div>

      <div className="pt-6">
        <HolidaySectionHeading>Cancellation Information</HolidaySectionHeading>
        {HOLIDAY_CANCELLATION_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex border border-t-0 border-slate-300 text-[12.5px]"
          >
            <div className="w-[140px] border-r border-slate-300 px-2 py-1 text-center font-bold">
              {row.label}
            </div>
            <div className="flex-1 px-2 py-1 text-center">{row.value}</div>
          </div>
        ))}
        <div
          className="border border-t-0 border-slate-300 px-4 py-3 text-center text-[10.5px] italic leading-snug"
          style={{ color: HOLIDAY_PDF_RED }}
        >
          {HOLIDAY_TAX_NOTE}
        </div>
      </div>

      <HolidaySkyguruContactFooter
        consultantName={consultantName}
        consultantWhatsapp={consultantWhatsapp}
        consultantDesignation={consultantDesignation}
      />
    </HolidaySkyguruPageShell>
  );
}
