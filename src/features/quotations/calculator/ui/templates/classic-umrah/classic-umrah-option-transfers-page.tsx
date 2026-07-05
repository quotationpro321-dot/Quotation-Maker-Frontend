import {
  calculateTotalQuoteValue,
  listQuotationPricingRows,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import { normalizeCustomIncludedServices } from "@/features/quotations/calculator/lib/quotation-custom-included-services";
import {
  UMRAH_PDF_RED,
  UMRAH_PDF_TEAL,
  UMRAH_SERVICE_CHECKLIST,
  UMRAH_TRANSFER_INSTRUCTION,
  UMRAH_VISA_NOTE,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";
import {
  isTransferSectionExported,
  isVisaSectionExported,
} from "@/features/quotations/calculator/lib/quotation-section-export";
import type { TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahPageShell } from "./classic-umrah-page-shell";

function formatWholeMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

function RoutePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-slate-200 px-3 py-1 text-[12.5px] font-bold text-slate-900">
      {children}
    </span>
  );
}

function ChecklistRow({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-[15px] shrink-0 items-center justify-center border border-slate-700 text-[11px] leading-none text-slate-900">
        {checked ? "✓" : ""}
      </span>
      <span className="text-[13px] text-slate-900">{label}</span>
    </div>
  );
}

function EsimBadge() {
  return (
    <div className="mx-auto my-4 flex size-[120px] flex-col items-center justify-center rounded-full border-2 border-sky-200 bg-sky-50">
      <span className="rounded-full border border-sky-400 px-2 py-px text-[9px] font-bold tracking-wide text-emerald-600">
        FREE
      </span>
      <span className="pt-0.5 text-[11px] font-extrabold text-sky-700">
        SAUDI ARABIA
      </span>
      <span className="my-1 rounded bg-sky-600 px-2 py-1 text-[9px] font-bold text-white">
        eSIM
      </span>
      <span className="text-[13px] font-black text-sky-700">4G/5G</span>
    </div>
  );
}

export function ClassicUmrahOptionTransfersPage({
  option,
  currency,
}: {
  option: TQuotationOption;
  currency: string;
}) {
  const showTransfers = isTransferSectionExported(option);
  const showVisa = isVisaSectionExported(option);
  const pricingRows = listQuotationPricingRows(option);
  const totalQuoteValue = calculateTotalQuoteValue(option);
  const customIncludedServices = normalizeCustomIncludedServices(
    option.customIncludedServices,
  ).filter((service) => service.label.trim());
  const visaLines = [
    { pax: option.visaEVW.pax, label: "Saudi EVW Visa" },
    { pax: option.visaUmrah.pax, label: "Saudi Umrah Visa" },
  ].filter((line) => line.pax > 0);

  return (
    <ClassicUmrahPageShell>
      {showTransfers ? (
        <>
          <h2 className="text-center text-[16px] font-bold">TRANSFERS:</h2>
          <p className="pb-4 text-center text-[14px] font-semibold">
            Private Transfers
          </p>

          <div className="space-y-2">
            {option.routes
              .filter((route) => route.from || route.to)
              .map((route) => (
                <div
                  key={route.id}
                  className="grid grid-cols-[170px_1fr_170px] items-center gap-2"
                >
                  <RoutePill>{route.from || "—"}</RoutePill>
                  <span className="text-center text-[12px] tracking-tight text-slate-800">
                    {"------------------------->>"}
                  </span>
                  <RoutePill>{route.to || "—"}</RoutePill>
                </div>
              ))}
          </div>

          <div className="space-y-1.5 pt-6 pl-10">
            {UMRAH_SERVICE_CHECKLIST.map((service) => (
              <ChecklistRow
                key={service.id}
                checked={Boolean(option.includedServices[service.id])}
                label={service.label}
              />
            ))}
            {customIncludedServices.map((service) => (
              <ChecklistRow
                key={service.id}
                checked={service.included}
                label={service.label.trim()}
              />
            ))}
          </div>

          {option.includedServices.esim ? <EsimBadge /> : <div className="py-4" />}
        </>
      ) : null}

      {showVisa ? (
        <>
          <h2
            className={`text-center text-[16px] font-bold ${showTransfers ? "pt-6" : "pt-2"}`}
          >
            VISA:
          </h2>
          <div className="pl-10 pt-1">
            {visaLines.length > 0 ? (
              visaLines.map((line) => (
                <p key={line.label} className="text-[13.5px] text-slate-900">
                  ● {line.pax} x {line.label}
                </p>
              ))
            ) : (
              <p className="text-[13.5px] text-slate-500">● Visa not included</p>
            )}
            <p
              className="pt-1 text-[11px] italic leading-snug"
              style={{ color: UMRAH_PDF_RED }}
            >
              {UMRAH_VISA_NOTE}
            </p>
          </div>
        </>
      ) : null}

      {!showTransfers && !showVisa ? <div className="pt-2" /> : null}

      <div className="mt-auto pb-8">
        <div
          className="px-3 py-1.5 text-center text-[14px] font-bold text-white"
          style={{ backgroundColor: UMRAH_PDF_TEAL }}
        >
          Pricing Information:
        </div>
        {pricingRows.map((row) => (
          <div
            key={row.label}
            className="flex border border-t-0 border-slate-900"
          >
            <div className="flex-1 border-r border-slate-900 px-3 py-1 text-[13px] font-bold">
              {row.label}
            </div>
            <div className="w-[160px] px-3 py-1 text-[13px]">
              {formatWholeMoney(row.grossPerPerson, currency)} PP x {row.quantity}
            </div>
          </div>
        ))}
        <div className="flex border border-t-0 border-slate-900">
          <div className="flex-1 border-r border-slate-900 px-3 py-1 text-right text-[13px] font-bold">
            Total Quote Value
          </div>
          <div className="w-[160px] px-3 py-1 text-right text-[13px] font-bold">
            {formatWholeMoney(totalQuoteValue, currency)}
          </div>
        </div>
        {showTransfers ? (
          <div
            className="space-y-1 border border-t-0 border-slate-900 px-4 py-2 text-center text-[10.5px] italic leading-snug"
            style={{ color: UMRAH_PDF_RED }}
          >
            <p className="font-bold">{UMRAH_TRANSFER_INSTRUCTION.title}</p>
            <p>{UMRAH_TRANSFER_INSTRUCTION.body}</p>
            <p className="font-semibold">{UMRAH_TRANSFER_INSTRUCTION.driversNote}</p>
          </div>
        ) : null}
      </div>
    </ClassicUmrahPageShell>
  );
}
