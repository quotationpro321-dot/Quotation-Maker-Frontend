export type TQuotationStatus = "draft" | "pending" | "confirmed" | "cancelled";

export type TQuotationTemplateId = "classic" | "modern" | "compact";

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

export type TQuotationFlightSegment = {
  segmentOrder: number;
  airlineCode: string;
  airlineName: string;
  airlineLogoUrl: string;
  flightNumber: string;
  bookingClass: string;
  departureDateDisplay: string;
  departureTime: string;
  arrivalTime: string;
  arrivalDisplay: string;
  fromCode: string;
  fromName: string;
  toCode: string;
  toName: string;
};

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
};

export type TQuotationDraft = {
  id?: string;
  referenceNumber?: number;
  customerName: string;
  customerNumber: string;
  quotationDate: string;
  status: TQuotationStatus;
  currency: string;
  templateId: TQuotationTemplateId;
  options: TQuotationOption[];
  activeOptionIndex: number;
};

export type TQuotationDetail = TQuotationListItem & {
  customerNumber?: string;
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
