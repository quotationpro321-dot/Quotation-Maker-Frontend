import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";

export type TQuotationStatus = "draft" | "pending" | "confirmed" | "cancelled";

export type TQuotationTemplateId = "classic" | "modern" | "compact";
export type TQuotationCalculatorType = "umrah" | "holiday" | "flights";

export type TQuotationCreator = {
  id: string;
  name: string;
};

export type TQuotationListItem = {
  id: string;
  referenceNumber: number;
  customerName: string;
  customerPhone?: string;
  quotationDate: string;
  makkahHotel: string;
  madinahHotel: string;
  status: TQuotationStatus;
  createdBy: TQuotationCreator;
  totalValue?: number;
  currency: string;
};

export type TQuotationHotel = {
  name: string;
  roomType: string;
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

export type TQuotationFlightSegment = NormalizedSegment;

export type TQuotationOption = {
  id: string;
  title: string;
  flightAdult: number;
  flightYouth: number;
  flightChild: number;
  flightInfant: number;
  hotelMakkah: TQuotationHotel;
  hotelMadinah: TQuotationHotel;
  hotelHoliday: TQuotationHotel;
  visaUmrah: TQuotationVisaLine;
  visaEVW: TQuotationVisaLine;
  visaHoliday: TQuotationVisaLine;
  transferCost: number;
  routes: TQuotationRoute[];
  officeNote: string;
  customerNote: string;
  numPax: number;
  markupPerPerson: number;
  rawItinerary: string;
  flightSegments: TQuotationFlightSegment[];
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
  customerName: string;
  customerNumber: string;
  calculatorType: TQuotationCalculatorType;
  quotationDate: string;
  status: TQuotationStatus;
  currency: string;
  templateId: TQuotationTemplateId;
  calculatorStates: TQuotationCalculatorTypeStates;
};

export type TQuotationDetail = TQuotationListItem & {
  customerNumber?: string;
  calculatorType?: TQuotationCalculatorType;
  templateId: TQuotationTemplateId;
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
