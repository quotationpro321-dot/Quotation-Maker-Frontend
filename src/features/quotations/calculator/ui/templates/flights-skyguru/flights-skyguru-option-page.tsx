import {
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";
import {
  FLIGHT_DISCLAIMER,
  FLIGHT_DISCLAIMER_TITLE,
  FLIGHT_GREETING,
} from "@/features/quotations/calculator/lib/quotation-flights-skyguru.constants";
import {
  formatFlightAdultPrice,
  getFlightCabinLuggageLabel,
  getFlightHoldLuggageLabel,
  getFlightRouteTitle,
} from "@/features/quotations/calculator/lib/quotation-flights-summary";
import {
  getFlightItineraryImage,
  getFlightItineraryMode,
  hasFlightItineraryContent,
} from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import { hasExportableCustomerNote } from "@/features/quotations/calculator/lib/quotation-customer-note";
import {
  HOLIDAY_PAGE_MARGIN_PX,
  HOLIDAY_PDF_BLUE,
  HOLIDAY_PDF_RED,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";
import { QuotationFlightItineraryImagePreview } from "@/features/quotations/calculator/ui/quotation-flight-itinerary-image-preview";
import type { TQuotationDraft, TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahFlightsTable } from "../classic-umrah/classic-umrah-flights-table";
import {
  HolidayInfoRow,
  HolidaySectionHeading,
} from "../holiday-skyguru/holiday-skyguru-primitives";
import { FlightsSkyguruPageShell } from "./flights-skyguru-page-shell";

const FLIGHTS_TABLE_GUTTER_PX = 20;
const FLIGHTS_TABLE_BLEED_PX = HOLIDAY_PAGE_MARGIN_PX - FLIGHTS_TABLE_GUTTER_PX;
const FLIGHTS_CONTENT_WIDTH_PX =
  QUOTATION_A4_WIDTH_PX - HOLIDAY_PAGE_MARGIN_PX * 2;

type TFlightsSkyguruOptionPageProps = {
  draft: TQuotationDraft;
  option: TQuotationOption;
  currency: string;
  showGreeting: boolean;
  showDisclaimer: boolean;
};

export function FlightsSkyguruOptionPage({
  draft,
  option,
  currency,
  showGreeting,
  showDisclaimer,
}: TFlightsSkyguruOptionPageProps) {
  const segments = option.flightSegments ?? [];
  const isImageMode = getFlightItineraryMode(option) === "image";
  const itineraryImage = getFlightItineraryImage(option);
  const hasItinerary = hasFlightItineraryContent(option);
  const showCustomerNote = showDisclaimer && hasExportableCustomerNote(option);

  return (
    <FlightsSkyguruPageShell>
      {showGreeting ? (
        <div className="pb-5">
          <p className="text-[15px] font-bold text-slate-900">
            {FLIGHT_GREETING.salutation}
          </p>
          <p className="pt-1 text-[13px] leading-relaxed text-slate-700">
            {FLIGHT_GREETING.body}
          </p>
          {draft.customerName.trim() ? (
            <p className="pt-2 text-[12.5px] font-semibold text-slate-800">
              Ref: {draft.customerName.trim()}
            </p>
          ) : null}
        </div>
      ) : null}

      <h2
        className="pb-4 text-center text-[17px] font-bold"
        style={{ color: HOLIDAY_PDF_BLUE }}
      >
        {getFlightRouteTitle(option)}
      </h2>

      {hasItinerary ? (
        isImageMode && itineraryImage ? (
          <div className="flex justify-center pb-4">
            <QuotationFlightItineraryImagePreview
              src={itineraryImage}
              maxWidthPx={FLIGHTS_CONTENT_WIDTH_PX}
            />
          </div>
        ) : (
          <div
            className="flex justify-center pb-4"
            style={{
              marginLeft: -FLIGHTS_TABLE_BLEED_PX,
              marginRight: -FLIGHTS_TABLE_BLEED_PX,
            }}
          >
            <ClassicUmrahFlightsTable
              segments={segments}
              headerColor={HOLIDAY_PDF_BLUE}
            />
          </div>
        )
      ) : (
        <div className="mb-4 rounded-lg border border-dashed border-slate-300 px-5 py-8 text-center text-[13px] text-slate-500">
          Flight itinerary will appear here once added in the calculator.
        </div>
      )}

      <div>
        <HolidaySectionHeading>Baggage Information</HolidaySectionHeading>
        <HolidayInfoRow
          label="Hold Luggage"
          value={getFlightHoldLuggageLabel(option)}
        />
        <HolidayInfoRow
          label="Cabin Luggage"
          value={getFlightCabinLuggageLabel(option)}
        />
      </div>

      <div className="pt-5">
        <HolidaySectionHeading>Price Information</HolidaySectionHeading>
        <div className="border border-t-0 border-slate-300 px-4 py-3 text-[14px] font-bold text-slate-900">
          {formatFlightAdultPrice(option, currency)}
        </div>
      </div>

      {showCustomerNote ? (
        <div className="pt-5">
          <HolidaySectionHeading>Notes</HolidaySectionHeading>
          <div className="border border-t-0 border-slate-300 px-4 py-3 text-[12.5px] leading-relaxed text-slate-900">
            <p className="whitespace-pre-line">{option.customerNote.trim()}</p>
          </div>
        </div>
      ) : null}

      {showDisclaimer ? (
        <div className="mt-auto pt-6 pb-2">
          <p
            className="pb-2 text-[12px] font-bold"
            style={{ color: HOLIDAY_PDF_RED }}
          >
            {FLIGHT_DISCLAIMER_TITLE}
          </p>
          <p className="text-[10px] leading-snug text-slate-700">
            {FLIGHT_DISCLAIMER}
          </p>
        </div>
      ) : null}
    </FlightsSkyguruPageShell>
  );
}
