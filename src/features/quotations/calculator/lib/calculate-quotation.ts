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
  return (
    option.hotelMakkah.cost +
    option.hotelMadinah.cost +
    option.hotelHoliday.cost
  );
}

export function calculateVisaTotal(option: TQuotationOption): number {
  return (
    option.visaUmrah.pax * option.visaUmrah.cost +
    option.visaEVW.pax * option.visaEVW.cost +
    option.visaHoliday.pax * option.visaHoliday.cost
  );
}

export function calculateOptionTotals(option: TQuotationOption): TOptionTotals {
  const hotelTotal = calculateHotelTotal(option);
  const visaTotal = calculateVisaTotal(option);
  const serviceTotal = hotelTotal + visaTotal + option.transferCost;
  const perPersonServiceCost =
    option.numPax > 0 ? serviceTotal / option.numPax : 0;
  const flightTotal =
    option.flightAdult +
    option.flightYouth +
    option.flightChild +
    option.flightInfant;
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
  return flightCost + perPersonServiceCost + option.markupPerPerson;
}

export function formatQuotationMoney(value: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
