import { formatCurrency } from "@/features/dashboard/lib/format-dashboard";
import type { TQuotationCalculatorType } from "@/types/quotation.type";

const QUOTATION_TYPE_LABELS: Record<TQuotationCalculatorType, string> = {
  umrah: "Umrah",
  holiday: "Holiday",
  flights: "Flights",
};

export function formatQuotationDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toISOString().slice(0, 10);
}

export function formatQuotationRefId(refId: string): string {
  return refId;
}

export function formatQuotationType(calculatorType: TQuotationCalculatorType): string {
  return QUOTATION_TYPE_LABELS[calculatorType];
}

export function formatQuotationTotal(
  value: number | undefined,
  currency: string,
): string {
  if (value === undefined) return "—";
  return formatCurrency(value, currency);
}
