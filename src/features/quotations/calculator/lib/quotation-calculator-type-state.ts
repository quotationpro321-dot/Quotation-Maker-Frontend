import { createInitialOption } from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import type {
  TQuotationCalculatorType,
  TQuotationCalculatorTypeState,
  TQuotationCalculatorTypeStates,
  TQuotationDraft,
  TQuotationOption,
} from "@/types/quotation.type";

export const QUOTATION_CALCULATOR_TYPES: TQuotationCalculatorType[] = [
  "umrah",
  "holiday",
  "flights",
];

export function createEmptyCalculatorTypeState(
  calculatorType: TQuotationCalculatorType = "umrah",
): TQuotationCalculatorTypeState {
  return {
    options: [createInitialOption("Option 1", calculatorType)],
    activeOptionIndex: 0,
  };
}

export function createEmptyCalculatorStates(): TQuotationCalculatorTypeStates {
  return {
    umrah: createEmptyCalculatorTypeState("umrah"),
    holiday: createEmptyCalculatorTypeState("holiday"),
    flights: createEmptyCalculatorTypeState("flights"),
  };
}

export function getCalculatorTypeState(
  draft: TQuotationDraft,
  type: TQuotationCalculatorType = draft.calculatorType,
): TQuotationCalculatorTypeState {
  return draft.calculatorStates[type];
}

export function updateCalculatorTypeState(
  draft: TQuotationDraft,
  type: TQuotationCalculatorType,
  state: TQuotationCalculatorTypeState,
): TQuotationDraft {
  return {
    ...draft,
    calculatorStates: {
      ...draft.calculatorStates,
      [type]: state,
    },
  };
}

export function updateActiveCalculatorTypeState(
  draft: TQuotationDraft,
  updater: (state: TQuotationCalculatorTypeState) => TQuotationCalculatorTypeState,
): TQuotationDraft {
  const type = draft.calculatorType;
  return updateCalculatorTypeState(draft, type, updater(draft.calculatorStates[type]));
}

type TLegacyDraft = TQuotationDraft & {
  options?: TQuotationOption[];
  activeOptionIndex?: number;
};

export function hasLegacyFlatOptions(draft: TLegacyDraft): boolean {
  return (
    !draft.calculatorStates &&
    Array.isArray(draft.options) &&
    draft.options.length > 0
  );
}

export function migrateLegacyDraftToCalculatorStates(
  draft: TLegacyDraft,
): TQuotationCalculatorTypeStates {
  const calculatorType = draft.calculatorType ?? "umrah";
  const legacyState: TQuotationCalculatorTypeState = {
    options: draft.options ?? [createInitialOption()],
    activeOptionIndex: draft.activeOptionIndex ?? 0,
  };

  const calculatorStates = createEmptyCalculatorStates();
  calculatorStates[calculatorType] = legacyState;
  return calculatorStates;
}
