import type { THotelAreaDto } from "@/redux/api/hotels.api";
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

export function showsHotelDistance(areaSlug: string | undefined): boolean {
  return areaSlug === "makkah" || areaSlug === "madinah";
}
