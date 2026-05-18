import { AlertCircle } from "lucide-react";

import type { ParseError, ParseWarning } from "@/features/flight-converter/types/flight-converter.types";

type ItineraryErrorStateProps = {
  errors: ParseError[];
  warnings: ParseWarning[];
  validationError?: string | null;
};

export function ItineraryErrorState({ errors, warnings, validationError }: ItineraryErrorStateProps) {
  const messages = [
    ...(validationError ? [{ code: "VALIDATION", message: validationError }] : []),
    ...errors,
  ];

  if (messages.length === 0 && warnings.length === 0) return null;

  return (
    <div className="space-y-3">
      {messages.map((err) => (
        <div
          key={`${err.code}-${err.message}`}
          className="flex gap-3 rounded! border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{err.message}</p>
        </div>
      ))}
      {warnings.length > 0 && (
        <ul className="rounded! border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-900 dark:text-amber-200">
          {warnings.map((w, i) => (
            <li key={`${w.code}-${i}`}>
              {w.line ? `Line ${w.line}: ` : ""}
              {w.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
