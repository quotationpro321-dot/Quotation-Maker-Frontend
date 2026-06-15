import { formatQuotationMoney } from "@/features/quotations/calculator/lib/calculate-quotation";
import {
  FLIGHT_DEFAULT_CABIN_LUGGAGE,
  FLIGHT_DEFAULT_HOLD_LUGGAGE,
} from "@/features/quotations/calculator/lib/quotation-flights-skyguru.constants";
import type { TQuotationOption } from "@/types/quotation.type";

export function getFlightRouteTitle(option: TQuotationOption): string {
  const segments = option.flightSegments ?? [];
  if (segments.length === 0) {
    return option.title.trim() || "Flight option";
  }

  const first = segments[0];
  const last = segments[segments.length - 1];
  const date = first.departureDateDisplay || first.departureDate || "";
  const from = first.fromName || first.fromCode || "—";
  const to = last.toName || last.toCode || "—";

  if (date) return `${date}, ${from} To ${to}`;
  return `${from} To ${to}`;
}

export function formatFlightAdultPrice(
  option: TQuotationOption,
  currency: string,
): string {
  return `Adult - ${formatQuotationMoney(option.flightAdult, currency)}`;
}

export function getFlightHoldLuggageLabel(option: TQuotationOption): string {
  const value = option.holdLuggage.trim();
  return value || FLIGHT_DEFAULT_HOLD_LUGGAGE;
}

export function getFlightCabinLuggageLabel(option: TQuotationOption): string {
  const value = option.cabinLuggage.trim();
  return value || FLIGHT_DEFAULT_CABIN_LUGGAGE;
}
