import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";
import type { TQuotationFlightSegment } from "@/types/quotation.type";

export function mapSegmentToQuotation(
  segment: NormalizedSegment,
): TQuotationFlightSegment {
  return {
    segmentOrder: segment.segmentOrder,
    airlineCode: segment.airlineCode,
    airlineName: segment.airlineName,
    airlineLogoUrl: segment.airlineLogoUrl,
    flightNumber: segment.flightNumber,
    bookingClass: segment.bookingClass,
    departureDateDisplay: segment.departureDateDisplay,
    departureTime: segment.departureTime,
    arrivalTime: segment.arrivalTime,
    arrivalDisplay: segment.arrivalDisplay,
    fromCode: segment.fromCode,
    fromName: segment.fromName,
    toCode: segment.toCode,
    toName: segment.toName,
  };
}

export function mapSegmentsToQuotation(
  segments: NormalizedSegment[],
): TQuotationFlightSegment[] {
  return segments.map(mapSegmentToQuotation);
}
