import { format } from "date-fns";

import { HOLIDAY_GREETING } from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";
import {
  getHolidayDestination,
  getHolidayDurationLabel,
  getHolidayGuestsLabel,
  getHolidayPackageHighlights,
} from "@/features/quotations/calculator/lib/quotation-holiday-summary";
import type { TQuotationDraft, TQuotationOption } from "@/types/quotation.type";

import { HolidaySkyguruPageShell } from "./holiday-skyguru-page-shell";
import {
  HolidayBulletList,
  HolidayInfoRow,
  HolidaySectionHeading,
} from "./holiday-skyguru-primitives";

type THolidaySkyguruSummaryPageProps = {
  draft: TQuotationDraft;
  option: TQuotationOption;
};

export function HolidaySkyguruSummaryPage({
  draft,
  option,
}: THolidaySkyguruSummaryPageProps) {
  const quoteDate = format(new Date(draft.quotationDate), "dd-MM-yyyy");
  const referenceNo = draft.refId || "—";
  const highlights = getHolidayPackageHighlights(option);

  return (
    <HolidaySkyguruPageShell>
      <div className="pb-5">
        <p className="text-[15px] font-bold text-slate-900">
          {HOLIDAY_GREETING.salutation}
        </p>
        <p className="pt-1 text-[13px] leading-relaxed text-slate-700">
          {HOLIDAY_GREETING.body}
        </p>
      </div>

      <div className="pb-6">
        <HolidaySectionHeading>Referral Information</HolidaySectionHeading>
        <HolidayInfoRow label="Quote Date" value={quoteDate} />
        <HolidayInfoRow label="Quotation Ref No" value={referenceNo} />
        <HolidayInfoRow label="Version" value="V1" />
        <HolidayInfoRow label="Ref" value={draft.customerName || "—"} />
      </div>

      <div className="pb-6">
        <HolidaySectionHeading>Travel Quotation Summary</HolidaySectionHeading>
        <HolidayInfoRow
          label="Destination"
          value={getHolidayDestination(option)}
          emphasis
        />
        <HolidayInfoRow label="Duration" value={getHolidayDurationLabel(option)} />
        <HolidayInfoRow label="Total Guests" value={getHolidayGuestsLabel(option)} />
      </div>

      <div>
        <p className="pb-3 text-[14px] font-bold text-slate-900">
          Package Highlights
        </p>
        <HolidayBulletList items={highlights} />
      </div>
    </HolidaySkyguruPageShell>
  );
}
