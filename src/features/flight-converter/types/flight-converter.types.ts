export type GdsFormat = "amadeus" | "sabre" | "galileo" | "worldspan" | "unknown";

export type TimeFormat = "12h" | "24h";

export interface ParseWarning {
  line?: number;
  code: string;
  message: string;
}

export interface ParseError {
  code: string;
  message: string;
}

export interface NormalizedSegment {
  segmentOrder: number;
  airlineCode: string;
  airlineName: string;
  airlineLogoUrl: string;
  flightNumber: string;
  bookingClass: string;
  cabinType?: string;
  departureDate: string;
  departureDateDisplay: string;
  arrivalDate: string;
  arrivalDateDisplay: string;
  departureTime: string;
  arrivalTime: string;
  arrivalDisplay: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
  durationMinutes: number | null;
  durationDisplay: string;
  transitMinutes: number | null;
  transitDisplay: string;
  terminalDepart?: string;
  terminalArrive?: string;
  parseConfidence: "high" | "partial";
  sourceLine?: string;
}

export interface ParseItineraryResponse {
  format: GdsFormat;
  segments: NormalizedSegment[];
  warnings: ParseWarning[];
  errors: ParseError[];
  meta: {
    segmentCount: number;
    parsedLineCount: number;
    skippedLineCount: number;
  };
}

export interface ParseItineraryRequest {
  rawText: string;
  options?: {
    timeFormat?: TimeFormat;
    showOperatedBy?: boolean;
  };
}
