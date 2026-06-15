import { calculateGross } from "@/features/quotations/calculator/lib/calculate-quotation";
import { hasExportableCustomerNote } from "@/features/quotations/calculator/lib/quotation-customer-note";
import {
  HOLIDAY_PDF_BLUE,
  HOLIDAY_PDF_RED,
  HOLIDAY_PRICING_TAX_NOTE,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";
import {
  computeStayNights,
  formatHolidayWholeMoney,
  formatStayNightsLabel,
} from "@/features/quotations/calculator/lib/quotation-holiday-summary";
import { listFilledHotelStays } from "@/features/quotations/calculator/lib/quotation-hotel-slots";
import { isHotelSectionExported } from "@/features/quotations/calculator/lib/quotation-section-export";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

import { HolidaySkyguruPageShell } from "./holiday-skyguru-page-shell";
import {
  HolidayInfoRow,
  HolidaySectionHeading,
} from "./holiday-skyguru-primitives";

function HotelInfoBlock({ hotel }: { hotel: TQuotationHotel }) {
  const nightsLabel = formatStayNightsLabel(
    computeStayNights(hotel.checkIn, hotel.checkOut),
  );

  return (
    <div className="rounded-md border border-slate-300">
      <div
        className="rounded-t-md px-4 py-2.5 text-[15px] font-bold text-white"
        style={{ backgroundColor: HOLIDAY_PDF_BLUE }}
      >
        {hotel.name || "Hotel to be confirmed"}
      </div>
      <div className="px-4 pt-3 pb-1 text-[12.5px] text-slate-800">
        <p>📍 {hotel.location || "—"}</p>
      </div>
      <div className="px-4 pb-4 pt-2">
        <HolidayInfoRow label="🔑 Check-In" value={hotel.checkIn || "—"} />
        <HolidayInfoRow label="🔑 Check-Out" value={hotel.checkOut || "—"} />
        <HolidayInfoRow label="🛌 Total Stay" value={nightsLabel} />
        <HolidayInfoRow label="🏨 Room" value={hotel.roomType || "—"} />
        <HolidayInfoRow label="Board" value={hotel.board || "—"} emphasis />
      </div>
    </div>
  );
}

type THolidaySkyguruOptionPageProps = {
  option: TQuotationOption;
  optionNumber: number;
  currency: string;
};

export function HolidaySkyguruOptionPage({
  option,
  optionNumber,
  currency,
}: THolidaySkyguruOptionPageProps) {
  const hotels = isHotelSectionExported(option)
    ? listFilledHotelStays(option)
    : [];
  const adultPrice = calculateGross(option, option.flightAdult);
  const showNote = hasExportableCustomerNote(option);

  return (
    <HolidaySkyguruPageShell>
      <h2
        className="text-[16px] font-bold"
        style={{ color: HOLIDAY_PDF_BLUE }}
      >
        Hotel Information
      </h2>
      <p className="pt-1 pb-4 text-[15px] font-bold text-slate-900">
        Option - {optionNumber}
      </p>

      <div className="space-y-5">
        {hotels.length > 0 ? (
          hotels.map(({ hotel, index }) => (
            <HotelInfoBlock key={`hotel-${index}`} hotel={hotel} />
          ))
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center text-[13px] text-slate-500">
            Hotel details will appear here once added in the calculator.
          </div>
        )}
      </div>

      <div className="pt-6">
        <HolidaySectionHeading>Pricing Information</HolidaySectionHeading>
        <HolidayInfoRow
          label="Adult"
          value={`${formatHolidayWholeMoney(adultPrice, currency)} pp x ${option.numPax}`}
          emphasis
        />
        <p
          className="border border-t-0 border-slate-300 px-3 py-1.5 text-[11px] italic"
          style={{ color: HOLIDAY_PDF_RED }}
        >
          {HOLIDAY_PRICING_TAX_NOTE}
        </p>
      </div>

      {showNote ? (
        <div className="pt-6">
          <HolidaySectionHeading>Notes</HolidaySectionHeading>
          <div className="border border-t-0 border-slate-300 px-4 py-3 text-[12.5px] leading-relaxed text-slate-900">
            <p className="whitespace-pre-line">{option.customerNote.trim()}</p>
          </div>
        </div>
      ) : null}
    </HolidaySkyguruPageShell>
  );
}
