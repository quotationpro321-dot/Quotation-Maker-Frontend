import { differenceInCalendarDays, isValid, parse } from "date-fns";

import {
  isFlightSectionExported,
  isHotelSectionExported,
  isTransferSectionExported,
} from "@/features/quotations/calculator/lib/quotation-section-export";
import { listFilledHotelStays } from "@/features/quotations/calculator/lib/quotation-hotel-slots";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

/** Matches the calculator's stored stay date format (`HotelStayDateRangeDialog`). */
const HOTEL_DATE_FORMAT = "dd MMM yyyy";

export function parseHotelStayDate(value: string): Date | undefined {
  if (!value) return undefined;
  const parsed = parse(value, HOTEL_DATE_FORMAT, new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function computeStayNights(
  checkIn: string,
  checkOut: string,
): number | null {
  const from = parseHotelStayDate(checkIn);
  const to = parseHotelStayDate(checkOut);
  if (!from || !to) return null;
  const nights = differenceInCalendarDays(to, from);
  return nights > 0 ? nights : null;
}

export function formatStayNightsLabel(nights: number | null): string {
  if (nights == null) return "—";
  const padded = String(nights).padStart(2, "0");
  return `${padded} ${nights === 1 ? "Night" : "Nights"}`;
}

export function getPrimaryHotel(option: TQuotationOption): TQuotationHotel | null {
  return listFilledHotelStays(option)[0]?.hotel ?? null;
}

export function getHolidayDestination(option: TQuotationOption): string {
  const hotel = getPrimaryHotel(option);
  if (!hotel) return "—";

  const location = hotel.location.trim();
  if (location) return location;

  const fromCityCountry = [hotel.city, hotel.country]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(", ");

  return fromCityCountry || "—";
}

export function getHolidayDurationLabel(option: TQuotationOption): string {
  const hotel = getPrimaryHotel(option);
  if (!hotel) return "—";
  return formatStayNightsLabel(computeStayNights(hotel.checkIn, hotel.checkOut));
}

export function getHolidayGuestsLabel(option: TQuotationOption): string {
  const count = Math.max(0, option.numPax);
  return `${count} ${count === 1 ? "Adult" : "Adults"}`;
}

export function getHolidayPackageHighlights(option: TQuotationOption): string[] {
  const highlights: string[] = [];
  const hotel = getPrimaryHotel(option);

  if (isHotelSectionExported(option) && hotel) {
    highlights.push(
      hotel.board ? `${hotel.board} Accommodation` : "Premium Hotel Accommodation",
    );
  }
  if (isTransferSectionExported(option)) highlights.push("Return Transfer");
  if (isFlightSectionExported(option)) highlights.push("Return Flights");

  return highlights.length > 0 ? highlights : ["Tailor-made holiday package"];
}

export function formatHolidayWholeMoney(value: number, currency: string): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
