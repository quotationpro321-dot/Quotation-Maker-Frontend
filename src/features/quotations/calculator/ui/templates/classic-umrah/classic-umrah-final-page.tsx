import { calculateGross } from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  UMRAH_BANK_DETAILS,
  UMRAH_CANCELLATION_NOTES,
  UMRAH_CANCELLATION_ROWS,
  UMRAH_PDF_RED,
  UMRAH_PDF_TEAL,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";
import type { TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahContactFooter } from "./classic-umrah-contact-footer";
import { ClassicUmrahPageShell } from "./classic-umrah-page-shell";

const DEPOSIT_ROWS = ["First Deposit", "Second Deposit", "Final Deposit"] as const;

function formatWholeMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function TealTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border border-slate-900 px-3 py-1.5 text-center text-[14px] font-bold text-white"
      style={{ backgroundColor: UMRAH_PDF_TEAL }}
    >
      {children}
    </div>
  );
}

export function ClassicUmrahFinalPage({
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
  const totalQuoteValue =
    calculateGross(option, option.flightAdult) * option.numPax;
  const zero = formatWholeMoney(0, currency);

  return (
    <ClassicUmrahPageShell hideFooterStrip>
      <div>
        <TealTableHeader>Payment Plan:</TealTableHeader>
        {DEPOSIT_ROWS.map((label) => (
          <div key={label} className="flex border border-t-0 border-slate-900 text-[12.5px]">
            <div className="w-[130px] border-r border-slate-900 px-2 py-1">{label}</div>
            <div className="w-[130px] border-r border-slate-900 px-2 py-1 text-center">
              <span className="rounded bg-slate-100 px-2">—</span>
            </div>
            <div className="flex-1 border-r border-slate-900 px-2 py-1">
              {zero} PP x 0
            </div>
            <div className="w-[150px] px-2 py-1">{zero}</div>
          </div>
        ))}
        <div className="flex border border-t-0 border-slate-900 text-[12.5px] font-bold">
          <div className="flex-1 border-r border-slate-900 px-2 py-1 text-right">
            Total Quote Value
          </div>
          <div className="w-[150px] px-2 py-1 text-right">
            {formatWholeMoney(totalQuoteValue, currency)}
          </div>
        </div>
        <div className="space-y-0.5 border border-t-0 border-slate-900 px-3 py-2 text-center text-[12.5px]">
          <p className="font-bold">{UMRAH_BANK_DETAILS.title}</p>
          <p>{UMRAH_BANK_DETAILS.companyName}</p>
          <p>{UMRAH_BANK_DETAILS.accountNumber}</p>
          <p>{UMRAH_BANK_DETAILS.sortCode}</p>
          <p>{UMRAH_BANK_DETAILS.paymentRef}</p>
        </div>
      </div>

      <div className="pt-8">
        <TealTableHeader>Cancellation Information:</TealTableHeader>
        {UMRAH_CANCELLATION_ROWS.map((row) => (
          <div
            key={row.label}
            className="flex border border-t-0 border-slate-900 text-[12.5px]"
          >
            <div className="w-[130px] border-r border-slate-900 px-2 py-1 text-center font-bold">
              {row.label}
            </div>
            <div className="flex-1 px-2 py-1 text-center">{row.value}</div>
          </div>
        ))}
        <div
          className="space-y-2 border border-t-0 border-slate-900 px-4 py-3 text-center text-[10.5px] italic leading-snug"
          style={{ color: UMRAH_PDF_RED }}
        >
          {UMRAH_CANCELLATION_NOTES.map((note) => (
            <p key={note.slice(0, 32)}>{note}</p>
          ))}
        </div>
      </div>

      <ClassicUmrahContactFooter
        consultantName={consultantName}
        consultantWhatsapp={consultantWhatsapp}
        consultantDesignation={consultantDesignation}
      />
    </ClassicUmrahPageShell>
  );
}
