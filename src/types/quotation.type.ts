import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";
import type { TQuotationCustomerSource } from "@/features/quotations/lib/quotation-customer-source";

export type TQuotationStatus = "draft" | "pending" | "confirmed" | "cancelled";

export type TQuotationTemplateId = "classic" | "modern" | "compact";
export type TQuotationCalculatorType = "umrah" | "holiday" | "flights";
export type { TQuotationCustomerSource };

export type TQuotationCreator = {
  id: string;
  name: string;
};

export type TQuotationListItem = {
  id: string;
  referenceNumber: number;
  refId: string;
  readableId: string;
  calculatorType: TQuotationCalculatorType;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  customerSource?: TQuotationCustomerSource;
  quotationDate: string;
  makkahHotel: string;
  madinahHotel: string;
  status: TQuotationStatus;
  completedOptionId?: string;
  completedOptionTitle?: string;
  deletedAt?: string;
  createdBy: TQuotationCreator;
  totalValue?: number;
  currency: string;
};

export type TUpdateQuotationStatusPayload = {
  status: TQuotationStatus;
  /** Required when status is confirmed; exactly one option. */
  completedOptionId?: string;
};

export type TQuotationHotel = {
  name: string;
  city: string;
  country: string;
  location: string;
  areaSlug?: string;
  distance: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  board: string;
  cost: number;
};

export type TQuotationVisaLine = {
  pax: number;
  cost: number;
};

export type TQuotationRoute = {
  id: string;
  from: string;
  to: string;
};

export type TQuotationIncludedServices = {
  guide: boolean;
  ziyarah: boolean;
  train: boolean;
  manager: boolean;
  esim: boolean;
};

export type TQuotationCustomIncludedService = {
  id: string;
  label: string;
  included: boolean;
};

export type TQuotationFlightSegment = NormalizedSegment;

export type TFlightItineraryInputMode = "text" | "image";

/** Independent flight block (itinerary + fares) for one family group. */
export type TQuotationFlightFamily = {
  id: string;
  flightAdult: number;
  flightYouth: number;
  flightChild: number;
  flightInfant: number;
  rawItinerary: string;
  flightSegments: TQuotationFlightSegment[];
  flightItineraryMode: TFlightItineraryInputMode;
  flightItineraryImage: string;
  holdLuggage: string;
  cabinLuggage: string;
};

export type TQuotationOption = {
  id: string;
  title: string;
  /** @deprecated Prefer `flightFamilies[0]`; kept for templates/API sync. */
  flightAdult: number;
  /** @deprecated Prefer `flightFamilies[0]`; kept for templates/API sync. */
  flightYouth: number;
  /** @deprecated Prefer `flightFamilies[0]`; kept for templates/API sync. */
  flightChild: number;
  /** @deprecated Prefer `flightFamilies[0]`; kept for templates/API sync. */
  flightInfant: number;
  /** One or more independent flight sections (Add Family). */
  flightFamilies: TQuotationFlightFamily[];
  hotels: TQuotationHotel[];
  visaUmrah: TQuotationVisaLine;
  visaEVW: TQuotationVisaLine;
  visaHoliday: TQuotationVisaLine;
  visaSaudiTourist: TQuotationVisaLine;
  transferCost: number;
  /** Cost applied when `includedServices.ziyarah` is true. */
  ziyarahCost: number;
  includedServices: TQuotationIncludedServices;
  customIncludedServices: TQuotationCustomIncludedService[];
  vehicleName: string;
  vehicleQuantity: number;
  routes: TQuotationRoute[];
  officeNote: string;
  customerNote: string;
  numPax: number;
  markupPerPerson: number;
  rawItinerary: string;
  flightSegments: TQuotationFlightSegment[];
  flightItineraryMode: TFlightItineraryInputMode;
  /** JPEG data URL shown in preview/PDF when mode is `image`. */
  flightItineraryImage: string;
  holdLuggage: string;
  cabinLuggage: string;
  flightSectionEnabled: boolean;
  hotelSectionEnabled: boolean;
  visaSectionEnabled: boolean;
  transferSectionEnabled: boolean;
  officeNoteSectionEnabled: boolean;
  customerNoteSectionEnabled: boolean;
};

export type TQuotationCalculatorTypeState = {
  options: TQuotationOption[];
  activeOptionIndex: number;
};

export type TQuotationCalculatorTypeStates = Record<
  TQuotationCalculatorType,
  TQuotationCalculatorTypeState
>;

export type TQuotationDraft = {
  id?: string;
  referenceNumber?: number;
  refId?: string;
  readableId?: string;
  customerName: string;
  customerNumber: string;
  customerEmail: string;
  customerSource: TQuotationCustomerSource | "";
  calculatorType: TQuotationCalculatorType;
  quotationDate: string;
  status: TQuotationStatus;
  currency: string;
  templateId: TQuotationTemplateId;
  calculatorStates: TQuotationCalculatorTypeStates;
};

export type TQuotationDetail = TQuotationListItem & {
  customerNumber?: string;
  templateId: TQuotationTemplateId;
  calculatorStates?: TQuotationCalculatorTypeStates;
  options: TQuotationOption[];
};

export type TListQuotationsParams = {
  page: number;
  limit: number;
  search?: string;
  status?: TQuotationStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  createdById?: string;
};

export type TQuotationsListData = {
  items: TQuotationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
