import { z } from "zod";

export const flightConverterInputSchema = z.object({
  rawText: z
    .string()
    .trim()
    .min(10, "Paste at least one valid flight segment line.")
    .max(50_000, "Itinerary text is too long."),
});

export type TFlightConverterInput = z.infer<typeof flightConverterInputSchema>;
