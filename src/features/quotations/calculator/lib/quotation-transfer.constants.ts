import type {
  TQuotationCalculatorType,
  TQuotationIncludedServices,
} from "@/types/quotation.type";

export const DEFAULT_INCLUDED_SERVICES: TQuotationIncludedServices = {
  guide: true,
  ziyarah: true,
  train: false,
  manager: true,
  esim: true,
};

export const INCLUDED_SERVICE_OPTIONS: Array<{
  id: keyof TQuotationIncludedServices;
  label: string;
}> = [
  { id: "guide", label: "Local guide" },
  { id: "ziyarah", label: "Ziyarah included" },
  { id: "train", label: "Haramain train" },
  { id: "manager", label: "Umrah manager" },
  { id: "esim", label: "Complimentary eSIM" },
];

export type TTransferRouteOption = {
  value: string;
  label: string;
};

/** Holiday quotations use generic endpoints — no per-city airport/hotel catalog. */
export const HOLIDAY_TRANSFER_FROM_OPTIONS: TTransferRouteOption[] = [
  { value: "airport", label: "Airport" },
];

export const HOLIDAY_TRANSFER_TO_OPTIONS: TTransferRouteOption[] = [
  { value: "hotel", label: "Hotel" },
];

const HOLIDAY_TRANSFER_LABELS: Record<string, string> = {
  airport: "Airport",
  hotel: "Hotel",
};

export function usesHolidayTransferRoutes(
  calculatorType: TQuotationCalculatorType,
): boolean {
  return calculatorType === "holiday";
}

export function formatTransferRouteEndpoint(
  value: string,
  calculatorType: TQuotationCalculatorType,
): string {
  if (!value) return value;
  if (calculatorType === "holiday") {
    return HOLIDAY_TRANSFER_LABELS[value] ?? value;
  }
  return value;
}
