import type { TQuotationIncludedServices } from "@/types/quotation.type";

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

export function formatTransferRouteEndpoint(value: string): string {
  return value;
}
