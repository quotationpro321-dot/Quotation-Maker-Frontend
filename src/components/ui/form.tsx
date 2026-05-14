"use client";

import type { FieldValues, FormProviderProps } from "react-hook-form";
import { FormProvider } from "react-hook-form";

/** Thin alias over `FormProvider` for shadcn-style `<Form {...methods}>`. */
export function Form<TFieldValues extends FieldValues = FieldValues>({
  ...props
}: FormProviderProps<TFieldValues>) {
  return <FormProvider {...props} />;
}
