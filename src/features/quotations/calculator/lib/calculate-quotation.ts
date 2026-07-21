import type {
  TQuotationCalculatorType,
  TQuotationOption,
  TQuotationVisaLine,
} from "@/types/quotation.type";

export type TVisaFieldKey = keyof Pick<
  TQuotationOption,
  "visaUmrah" | "visaEVW" | "visaHoliday"
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
  serviceTotal: number;
  perPersonServiceCost: number;
  flightTotal: number;
  totalMarkup: number;
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
      const visa = option[field] as TQuotationVisaLine;
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
  const serviceTotal = hotelTotal + visaTotal + transferCost;
  const perPersonServiceCost =
    option.numPax > 0 ? serviceTotal / option.numPax : 0;
  const flightTotal = option.flightSectionEnabled
    ? option.flightAdult +
      option.flightYouth +
      option.flightChild +
      option.flightInfant
    : 0;
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
  calculatorType: TQuotationCalculatorType = "umrah",
): number {
  const { perPersonServiceCost } = calculateOptionTotals(option, calculatorType);
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

/** Pricing rows for PDF export — Adult always; other categories when priced. */
export function listQuotationPricingRows(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType = "umrah",
): TQuotationPricingRow[] {
  const rows: TQuotationPricingRow[] = [
    {
      label: "Adult",
      grossPerPerson: calculateGross(option, option.flightAdult, calculatorType),
      quantity: Math.max(1, option.numPax),
    },
  ];

  for (const category of OPTIONAL_PRICING_CATEGORIES) {
    const flightCost = option[category.flightCostKey];
    if (flightCost > 0) {
      rows.push({
        label: category.label,
        grossPerPerson: calculateGross(option, flightCost, calculatorType),
        quantity: 1,
      });
    }
  }

  return rows;
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
