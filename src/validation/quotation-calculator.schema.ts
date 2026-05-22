import { z } from "zod";

const moneyField = z.coerce.number().min(0, "Must be zero or greater");

export const quotationCalculatorSaveSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerNumber: z.string().trim().optional(),
  options: z
    .array(
      z.object({
        numPax: z.coerce.number().int().min(1, "At least 1 passenger"),
        flightAdult: moneyField,
        flightYouth: moneyField,
        flightChild: moneyField,
        flightInfant: moneyField,
        markupPerPerson: moneyField,
        transferCost: moneyField,
        rawItinerary: z.string().max(10000).optional(),
      }),
    )
    .min(1, "At least one option is required"),
});

export type TQuotationCalculatorSaveInput = z.infer<
  typeof quotationCalculatorSaveSchema
>;
