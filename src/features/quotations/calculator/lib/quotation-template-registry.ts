import type { ComponentType } from "react";

import type { TQuotationTemplateId } from "@/types/quotation.type";

import { StubClassicTemplate } from "@/features/quotations/calculator/ui/templates/stub-classic-template";
import { StubCompactTemplate } from "@/features/quotations/calculator/ui/templates/stub-compact-template";
import { StubModernTemplate } from "@/features/quotations/calculator/ui/templates/stub-modern-template";

import type { TQuotationTemplateProps } from "./quotation-template.types";

export type TQuotationTemplateMeta = {
  id: TQuotationTemplateId;
  name: string;
  description: string;
  component: ComponentType<TQuotationTemplateProps>;
};

export const QUOTATION_TEMPLATES: TQuotationTemplateMeta[] = [
  {
    id: "classic",
    name: "Alsama",
    description: "Umrah cover and introduction pages; package details follow in export.",
    component: StubClassicTemplate,
  },
  {
    id: "modern",
    name: "Agent 1",
    description: "ALSAMA brand header with structured sections.",
    component: StubModernTemplate,
  },
  {
    id: "compact",
    name: "Agent 2",
    description: "Dense table-focused summary for quick review.",
    component: StubCompactTemplate,
  },
];

export function getQuotationTemplate(id: TQuotationTemplateId) {
  return QUOTATION_TEMPLATES.find((template) => template.id === id);
}
