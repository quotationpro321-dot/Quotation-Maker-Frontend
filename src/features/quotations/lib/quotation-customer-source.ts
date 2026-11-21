export const QUOTATION_CUSTOMER_SOURCES = [
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google" },
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website" },
  { value: "offline", label: "Offline" },
  { value: "referral", label: "Referral" },
  { value: "reference", label: "Reference" },
  { value: "walk_in", label: "Walk-in (Direct Office Visit)" },
] as const;

export type TQuotationCustomerSource =
  (typeof QUOTATION_CUSTOMER_SOURCES)[number]["value"];

export const QUOTATION_CUSTOMER_SOURCE_VALUES = QUOTATION_CUSTOMER_SOURCES.map(
  (source) => source.value,
) as [TQuotationCustomerSource, ...TQuotationCustomerSource[]];

export function getQuotationCustomerSourceLabel(
  value: string | undefined,
): string {
  if (!value) return "";
  return (
    QUOTATION_CUSTOMER_SOURCES.find((source) => source.value === value)
      ?.label ?? value
  );
}
