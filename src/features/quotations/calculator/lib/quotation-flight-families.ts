import type {
  TFlightItineraryInputMode,
  TQuotationFlightFamily,
  TQuotationFlightSegment,
  TQuotationOption,
} from "@/types/quotation.type";

export const MIN_FLIGHT_FAMILIES = 1;
export const MAX_FLIGHT_FAMILIES = 8;

export function getDefaultFlightFamilyTitle(index: number): string {
  return `Family ${index + 1}`;
}

export function getFlightFamilyHeading(
  family: Pick<TQuotationFlightFamily, "title">,
  index: number,
): string {
  const title = family.title?.trim();
  return title || getDefaultFlightFamilyTitle(index);
}

export function createEmptyFlightFamily(
  index = 0,
): TQuotationFlightFamily {
  return {
    id: crypto.randomUUID(),
    title: getDefaultFlightFamilyTitle(index),
    flightAdult: 0,
    flightYouth: 0,
    flightChild: 0,
    flightInfant: 0,
    rawItinerary: "",
    flightSegments: [],
    flightItineraryMode: "text",
    flightItineraryImage: "",
    holdLuggage: "",
    cabinLuggage: "",
  };
}

function createFlightFamilyFromLegacy(
  option: Pick<
    TQuotationOption,
    | "flightAdult"
    | "flightYouth"
    | "flightChild"
    | "flightInfant"
    | "rawItinerary"
    | "flightSegments"
    | "flightItineraryMode"
    | "flightItineraryImage"
    | "holdLuggage"
    | "cabinLuggage"
  >,
): TQuotationFlightFamily {
  return {
    id: crypto.randomUUID(),
    title: getDefaultFlightFamilyTitle(0),
    flightAdult: option.flightAdult ?? 0,
    flightYouth: option.flightYouth ?? 0,
    flightChild: option.flightChild ?? 0,
    flightInfant: option.flightInfant ?? 0,
    rawItinerary: option.rawItinerary ?? "",
    flightSegments: option.flightSegments ?? [],
    flightItineraryMode:
      option.flightItineraryMode === "image" ? "image" : "text",
    flightItineraryImage: option.flightItineraryImage ?? "",
    holdLuggage: option.holdLuggage ?? "",
    cabinLuggage: option.cabinLuggage ?? "",
  };
}

export function resolveFlightFamilies(
  option: TQuotationOption,
): TQuotationFlightFamily[] {
  if (option.flightFamilies?.length) {
    return option.flightFamilies.map((family, index) => ({
      ...createEmptyFlightFamily(index),
      ...family,
      id: family.id || crypto.randomUUID(),
      title: family.title?.trim() || getDefaultFlightFamilyTitle(index),
      flightItineraryMode:
        family.flightItineraryMode === "image" ? "image" : "text",
      flightSegments: family.flightSegments ?? [],
      flightItineraryImage: family.flightItineraryImage ?? "",
    }));
  }

  return [createFlightFamilyFromLegacy(option)];
}

export function calculateFlightFamiliesTotal(
  families: TQuotationFlightFamily[],
): number {
  return families.reduce(
    (total, family) =>
      total +
      family.flightAdult +
      family.flightYouth +
      family.flightChild +
      family.flightInfant,
    0,
  );
}

/** Keep legacy flat flight fields in sync with Family 1 for templates/calc. */
export function syncOptionFromFlightFamilies(
  families: TQuotationFlightFamily[],
): Pick<
  TQuotationOption,
  | "flightFamilies"
  | "flightAdult"
  | "flightYouth"
  | "flightChild"
  | "flightInfant"
  | "rawItinerary"
  | "flightSegments"
  | "flightItineraryMode"
  | "flightItineraryImage"
  | "holdLuggage"
  | "cabinLuggage"
> {
  const primary = families[0] ?? createEmptyFlightFamily();
  const normalizedFamilies = families.length
    ? families
    : [createEmptyFlightFamily()];

  return {
    flightFamilies: normalizedFamilies,
    flightAdult: primary.flightAdult,
    flightYouth: primary.flightYouth,
    flightChild: primary.flightChild,
    flightInfant: primary.flightInfant,
    rawItinerary: primary.rawItinerary,
    flightSegments: primary.flightSegments,
    flightItineraryMode: primary.flightItineraryMode,
    flightItineraryImage: primary.flightItineraryImage,
    holdLuggage: primary.holdLuggage,
    cabinLuggage: primary.cabinLuggage,
  };
}

export function updateFlightFamilyInList(
  families: TQuotationFlightFamily[],
  familyId: string,
  patch: Partial<TQuotationFlightFamily>,
): TQuotationFlightFamily[] {
  return families.map((family) =>
    family.id === familyId ? { ...family, ...patch } : family,
  );
}

export function getFlightFamilyMode(
  family: Pick<TQuotationFlightFamily, "flightItineraryMode">,
): TFlightItineraryInputMode {
  return family.flightItineraryMode === "image" ? "image" : "text";
}

export function hasFlightFamilyItineraryContent(
  family: TQuotationFlightFamily,
): boolean {
  if (getFlightFamilyMode(family) === "image") {
    return Boolean(family.flightItineraryImage?.trim());
  }
  return (family.flightSegments ?? []).length > 0;
}

export type TFlightFamilyPriceField = keyof Pick<
  TQuotationFlightFamily,
  "flightAdult" | "flightYouth" | "flightChild" | "flightInfant"
>;

export function normalizeFlightFamilySegments(
  segments: TQuotationFlightSegment[] | undefined,
): TQuotationFlightSegment[] {
  return segments ?? [];
}
