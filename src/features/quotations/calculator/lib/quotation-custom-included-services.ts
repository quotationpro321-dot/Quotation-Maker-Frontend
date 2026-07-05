import { INCLUDED_SERVICE_OPTIONS } from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import type {
  TQuotationCalculatorType,
  TQuotationCustomIncludedService,
  TQuotationOption,
} from "@/types/quotation.type";

const MAX_CUSTOM_INCLUDED_SERVICES = 20;
const MAX_LABEL_LENGTH = 120;

export function createCustomIncludedService(
  label = "",
): TQuotationCustomIncludedService {
  return {
    id: crypto.randomUUID(),
    label,
    included: false,
  };
}

export function normalizeCustomIncludedServices(
  services: TQuotationCustomIncludedService[] | undefined,
): TQuotationCustomIncludedService[] {
  if (!Array.isArray(services)) return [];

  return services
    .filter((service) => service && typeof service === "object")
    .slice(0, MAX_CUSTOM_INCLUDED_SERVICES)
    .map((service) => ({
      id: service.id || crypto.randomUUID(),
      label: (service.label ?? "").slice(0, MAX_LABEL_LENGTH),
      included: Boolean(service.included),
    }));
}

export function canAddCustomIncludedService(
  services: TQuotationCustomIncludedService[] | undefined,
): boolean {
  return normalizeCustomIncludedServices(services).length < MAX_CUSTOM_INCLUDED_SERVICES;
}

export function listCheckedIncludedServiceLabels(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType = "umrah",
): string[] {
  const defaultLabels =
    calculatorType === "holiday"
      ? []
      : INCLUDED_SERVICE_OPTIONS.filter(
          (service) => option.includedServices?.[service.id],
        ).map((service) => service.label);

  const customLabels = normalizeCustomIncludedServices(
    option.customIncludedServices,
  )
    .filter((service) => service.included && service.label.trim())
    .map((service) => service.label.trim());

  return [...defaultLabels, ...customLabels];
}

export function hasCustomIncludedServiceContent(
  services: TQuotationCustomIncludedService[] | undefined,
): boolean {
  return normalizeCustomIncludedServices(services).some((service) =>
    service.label.trim(),
  );
}
