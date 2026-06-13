import type { THotelAreaDto, THotelDto } from "@/redux/api/hotels.api";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

export const HOTEL_SLOT_FIELDS = [
  "hotelMakkah",
  "hotelMadinah",
  "hotelHoliday",
] as const;

export type THotelSlotField = (typeof HOTEL_SLOT_FIELDS)[number];

export function listHotelSlots(
  option: TQuotationOption,
): Array<{ field: THotelSlotField; hotel: TQuotationHotel }> {
  return HOTEL_SLOT_FIELDS.map((field) => ({ field, hotel: option[field] }));
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

export function getUsedAreaSlugs(
  option: TQuotationOption,
  areas: THotelAreaDto[],
  excludeField: THotelSlotField,
): Set<string> {
  const used = new Set<string>();

  for (const { field, hotel } of listHotelSlots(option)) {
    if (field === excludeField) continue;
    const slug = resolveHotelAreaSlug(hotel, areas);
    if (slug) used.add(slug);
  }

  return used;
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

export function getUsedCustomLocations(
  option: TQuotationOption,
  areas: THotelAreaDto[],
  excludeField: THotelSlotField,
): Set<string> {
  const used = new Set<string>();

  for (const { field, hotel } of listHotelSlots(option)) {
    if (field === excludeField) continue;
    if (isCatalogArea(hotel, areas)) continue;
    const key = hotel.location.trim().toLowerCase();
    if (key) used.add(key);
  }

  return used;
}

export function showsHotelDistance(areaSlug: string | undefined): boolean {
  return areaSlug === "makkah" || areaSlug === "madinah";
}
