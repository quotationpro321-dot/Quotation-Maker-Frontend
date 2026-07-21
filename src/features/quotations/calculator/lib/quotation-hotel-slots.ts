import type { THotelAreaDto, THotelDto } from "@/redux/api/hotels.api";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

export const DEFAULT_HOTEL_STAY_COUNT = 3;
export const MIN_HOTEL_STAYS = 1;
export const MAX_HOTEL_STAYS = 12;

export type THotelSlot = {
  index: number;
  hotel: TQuotationHotel;
};

export const HOTELS_PER_PDF_PAGE = 2;

export type TFilledHotelStay = {
  hotel: TQuotationHotel;
  index: number;
};

export function hasHotelStayContent(hotel: TQuotationHotel): boolean {
  return Boolean(
    hotel.name ||
      hotel.location ||
      hotel.checkIn ||
      hotel.checkOut ||
      hotel.roomType ||
      hotel.board,
  );
}

export function listFilledHotelStays(option: TQuotationOption): TFilledHotelStay[] {
  return option.hotels
    .map((hotel, index) => ({ hotel, index }))
    .filter(({ hotel }) => hasHotelStayContent(hotel));
}

export function chunkFilledHotelStays(
  stays: TFilledHotelStay[],
  chunkSize = HOTELS_PER_PDF_PAGE,
): TFilledHotelStay[][] {
  if (stays.length === 0) return [[]];

  const chunks: TFilledHotelStay[][] = [];
  for (let index = 0; index < stays.length; index += chunkSize) {
    chunks.push(stays.slice(index, index + chunkSize));
  }
  return chunks;
}

export function listHotelSlots(option: TQuotationOption): THotelSlot[] {
  return option.hotels.map((hotel, index) => ({ index, hotel }));
}

export function getMaxHotelStayCount(options: TQuotationOption[]): number {
  return options.reduce(
    (maxCount, option) => Math.max(maxCount, option.hotels.length),
    0,
  );
}

export function getHotelStayHeading(index: number): string {
  return `Accommodation ${index + 1}`;
}

export function getHotelStayLabel(hotel: TQuotationHotel, index: number): string {
  if (hotel.areaSlug === "makkah") return "MAKKAH HOTEL";
  if (hotel.areaSlug === "madinah") return "MADINAH HOTEL";

  const location = hotel.location.trim();
  if (location) return `${location.toUpperCase()} HOTEL`;

  return `HOTEL STAY ${index + 1}`;
}

export function resolveHotelAreaSlug(
  hotel: TQuotationHotel,
  areas: THotelAreaDto[],
): string | undefined {
  if (hotel.areaSlug) return hotel.areaSlug;

  const locationKey = hotel.location.trim().toLowerCase();
  if (!locationKey) return undefined;

  const matched = areas.find(
    (area) => area.name === hotel.location || area.slug === locationKey,
  );
  return matched?.slug;
}

export function isCatalogArea(
  hotel: TQuotationHotel,
  areas: THotelAreaDto[],
): boolean {
  if (!hotel.areaSlug) return false;
  return areas.some((area) => area.slug === hotel.areaSlug);
}

export function getCustomLocationValue(
  hotel: TQuotationHotel,
  areas: THotelAreaDto[],
): string {
  if (isCatalogArea(hotel, areas)) return "";
  return hotel.location;
}

export function isCatalogHotel(
  hotel: TQuotationHotel,
  hotels: Pick<THotelDto, "name">[],
): boolean {
  if (!hotel.name) return false;
  return hotels.some((item) => item.name === hotel.name);
}

export function getCustomHotelValue(
  hotel: TQuotationHotel,
  hotels: Pick<THotelDto, "name">[],
): string {
  if (isCatalogHotel(hotel, hotels)) return "";
  return hotel.name;
}

export function showsHotelDistance(areaSlug: string | undefined): boolean {
  return areaSlug === "makkah" || areaSlug === "madinah";
}
