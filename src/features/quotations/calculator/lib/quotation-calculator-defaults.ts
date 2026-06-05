import { createEmptyCalculatorStates } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
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
    hotelMakkah: createEmptyHotel(),
    hotelMadinah: createEmptyHotel(),
    hotelHoliday: createEmptyHotel(),
    visaUmrah: { pax: 0, cost: 0 },
    visaEVW: { pax: 0, cost: 0 },
    visaHoliday: { pax: 0, cost: 0 },
    transferCost: 0,
    includedServices: { ...DEFAULT_INCLUDED_SERVICES },
    vehicleName: "",
    vehicleQuantity: 1,
    routes: [createRoute()],
    officeNote: "",
    customerNote: "",
    numPax: 1,
    markupPerPerson: 0,
    rawItinerary: "",
    flightSegments: [],
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
