import type { TQuotationOption } from "@/types/quotation.type";

export function isFlightSectionExported(option: TQuotationOption): boolean {
  return option.flightSectionEnabled;
}

export function isHotelSectionExported(option: TQuotationOption): boolean {
  return option.hotelSectionEnabled;
}

export function isVisaSectionExported(option: TQuotationOption): boolean {
  return option.visaSectionEnabled;
}

export function isTransferSectionExported(option: TQuotationOption): boolean {
  return option.transferSectionEnabled;
}

export function hasGroundServicesInExport(option: TQuotationOption): boolean {
  return (
    isHotelSectionExported(option) ||
    isVisaSectionExported(option) ||
    isTransferSectionExported(option)
  );
}
