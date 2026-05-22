import { formatCurrency } from "@/features/dashboard/lib/format-dashboard";

export function formatQuotationDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toISOString().slice(0, 10);
}

export function formatQuotationReference(referenceNumber: number): string {
  return String(referenceNumber);
}

export function formatQuotationTotal(
  value: number | undefined,
  currency: string,
): string {
  if (value === undefined) return "—";
  return formatCurrency(value, currency);
}
