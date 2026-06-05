import type { TQuotationIncludedServices } from "@/types/quotation.type";

export const DEFAULT_INCLUDED_SERVICES: TQuotationIncludedServices = {
  guide: true,
  ziyarah: true,
  manager: true,
  esim: true,
};

export const INCLUDED_SERVICE_OPTIONS: Array<{
  id: keyof TQuotationIncludedServices;
  label: string;
}> = [
  { id: "guide", label: "Local guide" },
  { id: "ziyarah", label: "Ziyarah included" },
  { id: "manager", label: "Umrah manager" },
  { id: "esim", label: "Complimentary eSIM" },
];
