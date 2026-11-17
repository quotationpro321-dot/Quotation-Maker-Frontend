import {
  calculateFlightFamiliesTotal,
  resolveFlightFamilies,
} from "@/features/quotations/calculator/lib/quotation-flight-families";
import type {
  TQuotationCalculatorType,
  TQuotationOption,
  TQuotationVisaLine,
} from "@/types/quotation.type";

export type TVisaFieldKey = keyof Pick<
  TQuotationOption,
  "visaUmrah" | "visaEVW" | "visaHoliday" | "visaSaudiTourist"
>;

export type TVisaFieldDefinition = {
  label: string;
  field: TVisaFieldKey;
  calculatorTypes: TQuotationCalculatorType[];
};

export const VISA_FIELD_DEFINITIONS: TVisaFieldDefinition[] = [
  { label: "Umrah visa", field: "visaUmrah", calculatorTypes: ["umrah"] },
  { label: "EVW visa", field: "visaEVW", calculatorTypes: ["umrah"] },
  {
    label: "Holiday visa",
    field: "visaHoliday",
    calculatorTypes: ["umrah", "holiday"],
  },
  {
    label: "Saudi Tourist Visa",
    field: "visaSaudiTourist",
    calculatorTypes: ["umrah", "holiday"],
  },
];

export function getVisaFieldsForCalculatorType(
  calculatorType: TQuotationCalculatorType,
): TVisaFieldDefinition[] {
  return VISA_FIELD_DEFINITIONS.filter((definition) =>
    definition.calculatorTypes.includes(calculatorType),
  );
}

export type TOptionTotals = {
  hotelTotal: number;
  visaTotal: number;
  transferCost: number;
  ziyarahCost: number;
  /** Hotel + visa + transfer (excludes ziyarah). */
  serviceTotal: number;
  perPersonServiceCost: number;
  /** Hotel + visa + transfer + ziyarah when ziyarah is included. */
  serviceTotalWithZiyarah: number;
  perPersonServiceCostWithZiyarah: number;
  hasZiyarahPricing: boolean;
  flightTotal: number;
  totalMarkup: number;
};

export type TCalculateGrossOptions = {
  includeZiyarah?: boolean;
};

export function calculateHotelTotal(option: TQuotationOption): number {
  return option.hotels.reduce((total, hotel) => total + hotel.cost, 0);
}

export function calculateVisaTotal(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType = "umrah",
): number {
  if (calculatorType === "flights") return 0;

  return getVisaFieldsForCalculatorType(calculatorType).reduce(
    (total, { field }) => {
      const visa = (option[field] as TQuotationVisaLine | undefined) ?? {
        pax: 0,
        cost: 0,
      };
      return total + visa.pax * visa.cost;
    },
    0,
  );
}

export function calculateOptionTotals(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType = "umrah",
): TOptionTotals {
  const hotelTotal = option.hotelSectionEnabled ? calculateHotelTotal(option) : 0;
  const visaTotal = option.visaSectionEnabled
    ? calculateVisaTotal(option, calculatorType)
    : 0;
  const transferCost = option.transferSectionEnabled ? option.transferCost : 0;
  const hasZiyarahPricing =
    option.transferSectionEnabled && Boolean(option.includedServices.ziyarah);
  const ziyarahCost = hasZiyarahPricing ? (option.ziyarahCost ?? 0) : 0;
  const serviceTotal = hotelTotal + visaTotal + transferCost;
  const serviceTotalWithZiyarah = serviceTotal + ziyarahCost;
  const perPersonServiceCost =
    option.numPax > 0 ? serviceTotal / option.numPax : 0;
  const perPersonServiceCostWithZiyarah =
    option.numPax > 0 ? serviceTotalWithZiyarah / option.numPax : 0;
  const flightTotal = option.flightSectionEnabled
    ? calculateFlightFamiliesTotal(resolveFlightFamilies(option))
    : 0;
  const totalMarkup = option.numPax * option.markupPerPerson;

  return {
    hotelTotal,
    visaTotal,
    transferCost,
    ziyarahCost,
    serviceTotal,
    perPersonServiceCost,
    serviceTotalWithZiyarah,
    perPersonServiceCostWithZiyarah,
    hasZiyarahPricing,
    flightTotal,
    totalMarkup,
  };
}

export function calculateGross(
  option: TQuotationOption,
  flightCost: number,
  calculatorType: TQuotationCalculatorType = "umrah",
  grossOptions: TCalculateGrossOptions = {},
): number {
  const totals = calculateOptionTotals(option, calculatorType);
  const perPersonServiceCost = grossOptions.includeZiyarah
    ? totals.perPersonServiceCostWithZiyarah
    : totals.perPersonServiceCost;
  const effectiveFlightCost = option.flightSectionEnabled ? flightCost : 0;
  return effectiveFlightCost + perPersonServiceCost + option.markupPerPerson;
}

export type TQuotationPricingRow = {
  label: string;
  grossPerPerson: number;
  quantity: number;
};

const OPTIONAL_PRICING_CATEGORIES: Array<{
  label: string;
  flightCostKey: keyof Pick<
    TQuotationOption,
    "flightYouth" | "flightChild" | "flightInfant"
  >;
}> = [
  { label: "Youth", flightCostKey: "flightYouth" },
  { label: "Child", flightCostKey: "flightChild" },
  { label: "Infant", flightCostKey: "flightInfant" },
];

function buildPricingRows(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType,
  includeZiyarah: boolean,
  labelSuffix: string,
): TQuotationPricingRow[] {
  const rows: TQuotationPricingRow[] = [
    {
      label: `Adult${labelSuffix}`,
      grossPerPerson: calculateGross(option, option.flightAdult, calculatorType, {
        includeZiyarah,
      }),
      quantity: Math.max(1, option.numPax),
    },
  ];

  for (const category of OPTIONAL_PRICING_CATEGORIES) {
    const flightCost = option[category.flightCostKey];
    if (flightCost > 0) {
      rows.push({
        label: `${category.label}${labelSuffix}`,
        grossPerPerson: calculateGross(option, flightCost, calculatorType, {
          includeZiyarah,
        }),
        quantity: 1,
      });
    }
  }

  return rows;
}

/**
 * Pricing rows for PDF/live export.
 * When ziyarah is included, returns without-ziyarah rows then with-ziyarah rows.
 */
export function listQuotationPricingRows(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType = "umrah",
): TQuotationPricingRow[] {
  const totals = calculateOptionTotals(option, calculatorType);

  if (!totals.hasZiyarahPricing) {
    return buildPricingRows(option, calculatorType, false, "");
  }

  return [
    ...buildPricingRows(option, calculatorType, false, " (without ziyarah)"),
    ...buildPricingRows(option, calculatorType, true, " (with ziyarah)"),
  ];
}

export function calculateTotalQuoteValue(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType = "umrah",
): number {
  return listQuotationPricingRows(option, calculatorType).reduce(
    (total, row) => total + row.grossPerPerson * row.quantity,
    0,
  );
}

export function formatQuotationMoney(value: number, currency = "GBP"): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
