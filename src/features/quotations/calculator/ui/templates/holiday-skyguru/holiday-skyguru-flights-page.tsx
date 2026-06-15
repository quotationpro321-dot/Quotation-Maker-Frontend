import {
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";
import {
  getFlightItineraryImage,
  getFlightItineraryMode,
  hasFlightItineraryContent,
} from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import {
  HOLIDAY_DEFAULT_CABIN_LUGGAGE,
  HOLIDAY_PAGE_MARGIN_PX,
  HOLIDAY_PDF_BLUE,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";
import { QuotationFlightItineraryImagePreview } from "@/features/quotations/calculator/ui/quotation-flight-itinerary-image-preview";
import type { TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahFlightsTable } from "../classic-umrah/classic-umrah-flights-table";
import { HolidaySkyguruPageShell } from "./holiday-skyguru-page-shell";
import { HolidayBulletList, HolidaySectionHeading } from "./holiday-skyguru-primitives";

const FLIGHTS_TABLE_GUTTER_PX = 20;
const FLIGHTS_TABLE_BLEED_PX = HOLIDAY_PAGE_MARGIN_PX - FLIGHTS_TABLE_GUTTER_PX;
const FLIGHTS_CONTENT_WIDTH_PX =
  QUOTATION_A4_WIDTH_PX - HOLIDAY_PAGE_MARGIN_PX * 2;

function buildBaggageItems(option: TQuotationOption): string[] {
  const items: string[] = [];
  if (option.holdLuggage.trim()) {
    items.push(`Hold luggage: ${option.holdLuggage.trim()}`);
  }
  items.push(
    option.cabinLuggage.trim()
      ? `Cabin baggage: ${option.cabinLuggage.trim()}`
      : HOLIDAY_DEFAULT_CABIN_LUGGAGE,
  );
  return items;
}

export function HolidaySkyguruFlightsPage({
  option,
}: {
  option: TQuotationOption;
}) {
  const segments = option.flightSegments ?? [];
  const isImageMode = getFlightItineraryMode(option) === "image";
  const itineraryImage = getFlightItineraryImage(option);
  const hasItinerary = hasFlightItineraryContent(option);

  return (
    <HolidaySkyguruPageShell>
      <h2
        className="pb-4 text-[16px] font-bold"
        style={{ color: HOLIDAY_PDF_BLUE }}
      >
        Flight Information
      </h2>

      {hasItinerary ? (
        isImageMode && itineraryImage ? (
          <div className="flex justify-center pb-2">
            <QuotationFlightItineraryImagePreview
              src={itineraryImage}
              maxWidthPx={FLIGHTS_CONTENT_WIDTH_PX}
            />
          </div>
        ) : (
          <div
            className="flex justify-center"
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
        <div className="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-[13px] text-slate-500">
          Flight itinerary will appear here once added in the calculator.
        </div>
      )}

      <div className="pt-10">
        <HolidaySectionHeading>Baggage Allowance</HolidaySectionHeading>
        <div className="border border-t-0 border-slate-300 px-4 py-4">
          <HolidayBulletList items={buildBaggageItems(option)} />
        </div>
      </div>
    </HolidaySkyguruPageShell>
  );
}
