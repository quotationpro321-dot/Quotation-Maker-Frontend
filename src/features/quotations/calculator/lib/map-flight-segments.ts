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
    cabinType: segment.cabinType,
    departureDate: segment.departureDate,
    departureDateDisplay: segment.departureDateDisplay,
    arrivalDate: segment.arrivalDate,
    arrivalDateDisplay: segment.arrivalDateDisplay,
    departureTime: segment.departureTime,
    arrivalTime: segment.arrivalTime,
    arrivalDisplay: segment.arrivalDisplay,
    fromCode: segment.fromCode,
    fromName: segment.fromName,
    toCode: segment.toCode,
    toName: segment.toName,
    durationMinutes: segment.durationMinutes,
    durationDisplay: segment.durationDisplay,
    transitMinutes: segment.transitMinutes,
    transitDisplay: segment.transitDisplay,
    terminalDepart: segment.terminalDepart,
    terminalArrive: segment.terminalArrive,
    parseConfidence: segment.parseConfidence,
    sourceLine: segment.sourceLine,
  };
}

export function mapSegmentsToQuotation(
  segments: NormalizedSegment[],
): TQuotationFlightSegment[] {
  return segments.map(mapSegmentToQuotation);
}
