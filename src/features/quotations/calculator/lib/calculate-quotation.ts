import type { TQuotationOption } from "@/types/quotation.type";

export type TOptionTotals = {
  hotelTotal: number;
  visaTotal: number;
  serviceTotal: number;
  perPersonServiceCost: number;
  flightTotal: number;
  totalMarkup: number;
};

export function calculateHotelTotal(option: TQuotationOption): number {
  return option.hotels.reduce((total, hotel) => total + hotel.cost, 0);
}

export function calculateVisaTotal(option: TQuotationOption): number {
  return (
    option.visaUmrah.pax * option.visaUmrah.cost +
    option.visaEVW.pax * option.visaEVW.cost +
    option.visaHoliday.pax * option.visaHoliday.cost
  );
}

export function calculateOptionTotals(option: TQuotationOption): TOptionTotals {
  const hotelTotal = option.hotelSectionEnabled ? calculateHotelTotal(option) : 0;
  const visaTotal = option.visaSectionEnabled ? calculateVisaTotal(option) : 0;
  const transferCost = option.transferSectionEnabled ? option.transferCost : 0;
  const serviceTotal = hotelTotal + visaTotal + transferCost;
  const perPersonServiceCost =
    option.numPax > 0 ? serviceTotal / option.numPax : 0;
  const flightTotal = option.flightSectionEnabled
    ? option.flightAdult +
      option.flightYouth +
      option.flightChild +
      option.flightInfant
    : 0;
  const totalMarkup = option.numPax * option.markupPerPerson;

  return {
    hotelTotal,
    visaTotal,
    serviceTotal,
    perPersonServiceCost,
    flightTotal,
    totalMarkup,
  };
}

export function calculateGross(
  option: TQuotationOption,
  flightCost: number,
): number {
  const { perPersonServiceCost } = calculateOptionTotals(option);
  const effectiveFlightCost = option.flightSectionEnabled ? flightCost : 0;
  return effectiveFlightCost + perPersonServiceCost + option.markupPerPerson;
}

export function formatQuotationMoney(value: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
