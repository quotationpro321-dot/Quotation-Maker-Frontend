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

export const HOLIDAY_DEFAULT_INCLUDED_SERVICES: TQuotationIncludedServices = {
  guide: false,
  ziyarah: false,
  train: false,
  manager: false,
  esim: false,
};

export function getDefaultIncludedServices(
  calculatorType: TQuotationCalculatorType = "umrah",
): TQuotationIncludedServices {
  return calculatorType === "holiday"
    ? { ...HOLIDAY_DEFAULT_INCLUDED_SERVICES }
    : { ...DEFAULT_INCLUDED_SERVICES };
}

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

export function getIncludedServiceOptionsForCalculatorType(
  calculatorType: TQuotationCalculatorType,
): typeof INCLUDED_SERVICE_OPTIONS {
  return calculatorType === "holiday" ? [] : INCLUDED_SERVICE_OPTIONS;
}

export type TTransferRouteOption = {
  value: string;
  label: string;
};

export function formatTransferRouteEndpoint(value: string): string {
  return value;
}
