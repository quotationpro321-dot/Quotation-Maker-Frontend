import { createEmptyCalculatorStates } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import { normalizeCustomIncludedServices } from "@/features/quotations/calculator/lib/quotation-custom-included-services";
import { DEFAULT_HOTEL_STAY_COUNT } from "@/features/quotations/calculator/lib/quotation-hotel-slots";
import { DEFAULT_INCLUDED_SERVICES } from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import type {
  TQuotationDraft,
  TQuotationHotel,
  TQuotationOption,
  TQuotationRoute,
} from "@/types/quotation.type";

export const HOTEL_BOARD_OPTIONS = [
  "All-Inclusive",
  "Half-Board",
  "Full-Board",
  "Bed & Breakfast",
  "Room Only",
] as const;

export function createEmptyHotel(
  location = "",
  areaSlug?: string,
): TQuotationHotel {
  return {
    name: "",
    city: "",
    country: "",
    location,
    areaSlug,
    distance: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    board: "",
    cost: 0,
  };
}

export function createDefaultHotels(
  count = DEFAULT_HOTEL_STAY_COUNT,
): TQuotationHotel[] {
  return Array.from({ length: count }, () => createEmptyHotel());
}

export const QUOTATION_DRAFT_STORAGE_KEY = "quotation-calculator-draft";

function createRoute(): TQuotationRoute {
  return { id: crypto.randomUUID(), from: "", to: "" };
}

export function createInitialOption(title = "Option 1"): TQuotationOption {
  return {
    id: crypto.randomUUID(),
    title,
    flightAdult: 0,
    flightYouth: 0,
    flightChild: 0,
    flightInfant: 0,
    hotels: createDefaultHotels(),
    visaUmrah: { pax: 0, cost: 0 },
    visaEVW: { pax: 0, cost: 0 },
    visaHoliday: { pax: 0, cost: 0 },
    transferCost: 0,
    includedServices: { ...DEFAULT_INCLUDED_SERVICES },
    customIncludedServices: [],
    vehicleName: "",
    vehicleQuantity: 1,
    routes: [createRoute()],
    officeNote: "",
    customerNote: "",
    numPax: 1,
    markupPerPerson: 0,
    rawItinerary: "",
    flightSegments: [],
    flightItineraryMode: "text",
    flightItineraryImage: "",
    holdLuggage: "",
    cabinLuggage: "",
    flightSectionEnabled: true,
    hotelSectionEnabled: true,
    visaSectionEnabled: true,
    transferSectionEnabled: true,
    officeNoteSectionEnabled: true,
    customerNoteSectionEnabled: true,
  };
}

export function createEmptyDraft(): TQuotationDraft {
  return {
    customerName: "",
    customerNumber: "",
    calculatorType: "umrah",
    quotationDate: new Date().toISOString(),
    status: "draft",
    currency: "GBP",
    templateId: "classic",
    calculatorStates: createEmptyCalculatorStates(),
  };
}

export function createRouteRow(): TQuotationRoute {
  return createRoute();
}

/** Copies all option fields from a source option; hotel slots stay empty for manual entry. */
export function createOptionFromPrevious(
  source: TQuotationOption,
): TQuotationOption {
  const copy = JSON.parse(JSON.stringify(source)) as TQuotationOption;
  return {
    ...copy,
    id: crypto.randomUUID(),
    title: "",
    hotels: createDefaultHotels(),
    flightItineraryMode:
      copy.flightItineraryMode === "image" ? "image" : "text",
    flightItineraryImage: copy.flightItineraryImage ?? "",
    customIncludedServices: normalizeCustomIncludedServices(
      copy.customIncludedServices,
    ),
  };
}
