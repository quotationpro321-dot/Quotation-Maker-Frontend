import {
  UMRAH_INVITE_LINE,
  UMRAH_PDF_TEAL,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";
import {
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";
import { hasFlightItineraryContent, getFlightItineraryImage, getFlightItineraryMode } from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import { QuotationFlightItineraryImagePreview } from "@/features/quotations/calculator/ui/quotation-flight-itinerary-image-preview";
import type { TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahFlightsTable } from "./classic-umrah-flights-table";
import {
  CLASSIC_UMRAH_PAGE_MARGIN_PX,
  ClassicUmrahPageShell,
} from "./classic-umrah-page-shell";

/** Small gutter so the wide itinerary table can use almost the full A4 width. */
const FLIGHTS_TABLE_GUTTER_PX = 20;
const FLIGHTS_TABLE_BLEED_PX =
  CLASSIC_UMRAH_PAGE_MARGIN_PX - FLIGHTS_TABLE_GUTTER_PX;
const FLIGHTS_CONTENT_WIDTH_PX =
  QUOTATION_A4_WIDTH_PX - CLASSIC_UMRAH_PAGE_MARGIN_PX * 2;

function BaggageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border border-slate-900 border-t-0 first:border-t">
      <div className="flex w-[185px] shrink-0 items-center justify-center border-r border-slate-900 px-3 py-5 text-[13px] text-slate-900">
        {label}
      </div>
      <div
        className="flex flex-1 items-center px-4 py-5 text-[13px] font-bold text-white"
        style={{ backgroundColor: UMRAH_PDF_TEAL }}
      >
        {value}
      </div>
    </div>
  );
}

export function ClassicUmrahFlightsPage({ option }: { option: TQuotationOption }) {
  const segments = option.flightSegments ?? [];
  const isImageMode = getFlightItineraryMode(option) === "image";
  const itineraryImage = getFlightItineraryImage(option);
  const hasItinerary = hasFlightItineraryContent(option);

  return (
    <ClassicUmrahPageShell>
      <p className="px-6 pt-2 text-center text-[14px] italic leading-snug text-slate-900">
        {UMRAH_INVITE_LINE}
      </p>

      <h2 className="pt-6 pb-4 text-center text-[16px] font-bold underline underline-offset-4">
        Flights Itinerary
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
            <ClassicUmrahFlightsTable segments={segments} />
          </div>
        )
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 px-5 py-10 text-center text-[13px] text-slate-500">
          Flight itinerary will appear here once added in the calculator.
        </div>
      )}

      <h2 className="pt-10 pb-4 text-center text-[16px] font-bold underline underline-offset-4">
        Baggage Information:
      </h2>
      <div>
        <BaggageRow
          label="Hold Luggage:"
          value={option.holdLuggage || "0 KG Per Person"}
        />
        <BaggageRow
          label="Cabin Luggage"
          value={option.cabinLuggage || "Small Baggage Per Person"}
        />
      </div>
    </ClassicUmrahPageShell>
  );
}
