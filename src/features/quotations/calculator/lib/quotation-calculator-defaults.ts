import { createEmptyCalculatorStates } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import type {
  TQuotationDraft,
  TQuotationOption,
  TQuotationRoute,
} from "@/types/quotation.type";

export const HOTELS_MAKKAH = [
  "Fairmont Makkah",
  "Pullman Zamzam",
  "Swissôtel Makkah",
  "Movenpick Hajar",
  "Adnan Hotel",
  "Hilton Makkah Convention Hotel",
];

export const HOTELS_MADINAH = [
  "Anwar Al Madinah",
  "Hilton Madinah",
  "Pullman Zamzam Madinah",
  "Shaza Al Madinah",
  "InterContinental Dar Al Iman",
];

export const HOTELS_HOLIDAY = [
  "Dubai Atlantis",
  "Istanbul Marriott",
  "London Hilton",
  "Paris Hyatt",
];

export const TRANSFER_LOCATIONS = [
  "Jeddah Airport",
  "Makkah Hotel",
  "Madinah Hotel",
  "Madinah Airport",
  "Haram",
  "Train Station",
];

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
    hotelMakkah: { name: "", roomType: "", cost: 0 },
    hotelMadinah: { name: "", roomType: "", cost: 0 },
    hotelHoliday: { name: "", roomType: "", cost: 0 },
    visaUmrah: { pax: 0, cost: 0 },
    visaEVW: { pax: 0, cost: 0 },
    visaHoliday: { pax: 0, cost: 0 },
    transferCost: 0,
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
