"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { calculateOptionTotals } from "@/features/quotations/calculator/lib/calculate-quotation";
import { mapSegmentsToQuotation } from "@/features/quotations/calculator/lib/map-flight-segments";
import {
  createEmptyDraft,
  createInitialOption,
  createRouteRow,
} from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import {
  getStorageKey,
  loadDraftFromStorage,
  loadMockQuotationDetail,
  saveDraftToStorage,
} from "@/features/quotations/calculator/lib/quotation-calculator-storage";
import {
  exportQuotationAsImage,
  exportQuotationAsPdf,
} from "@/features/quotations/calculator/lib/export-quotation";
import type {
  TQuotationDraft,
  TQuotationOption,
  TQuotationRoute,
  TQuotationTemplateId,
} from "@/types/quotation.type";
import type { UserRole } from "@/types/user.type";
import { useParseItineraryMutation } from "@/redux/api/flight-converter.api";
import { quotationCalculatorSaveSchema } from "@/validation/quotation-calculator.schema";

type TUseQuotationCalculatorOptions = {
  expectedRole: UserRole;
};

function cloneDraft(draft: TQuotationDraft): TQuotationDraft {
  return JSON.parse(JSON.stringify(draft)) as TQuotationDraft;
}

export function useQuotationCalculator({
  expectedRole,
}: TUseQuotationCalculatorOptions) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [draft, setDraft] = useState<TQuotationDraft>(() => createEmptyDraft());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const [parseItinerary, { isLoading: isParsingFlight }] =
    useParseItineraryMutation();

  const storageKey = getStorageKey(expectedRole, editId);

  useEffect(() => {
    const fromMock = editId ? loadMockQuotationDetail(editId) : null;
    const fromStorage = loadDraftFromStorage(storageKey);
    const initial = fromMock ?? fromStorage ?? createEmptyDraft();
    if (fromMock?.id) initial.id = fromMock.id;
    setDraft(initial);
    setIsInitialized(true);
  }, [editId, storageKey]);

  useEffect(() => {
    if (!isInitialized) return;
    const timeoutId = window.setTimeout(() => {
      saveDraftToStorage(storageKey, draft);
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [draft, isInitialized, storageKey]);

  const activeOption = draft.options[draft.activeOptionIndex] ?? draft.options[0];
  const activeTotals = useMemo(
    () => calculateOptionTotals(activeOption),
    [activeOption],
  );

  const updateDraft = useCallback((patch: Partial<TQuotationDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateActiveOption = useCallback((patch: Partial<TQuotationOption>) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((option, index) =>
        index === prev.activeOptionIndex ? { ...option, ...patch } : option,
      ),
    }));
  }, []);

  const setActiveOptionIndex = useCallback((index: number) => {
    setDraft((prev) => ({ ...prev, activeOptionIndex: index }));
  }, []);

  const addOption = useCallback(() => {
    setDraft((prev) => {
      const next = createInitialOption(`Option ${prev.options.length + 1}`);
      return {
        ...prev,
        options: [...prev.options, next],
        activeOptionIndex: prev.options.length,
      };
    });
  }, []);

  const removeOption = useCallback((index: number) => {
    setDraft((prev) => {
      if (prev.options.length <= 1) return prev;
      const options = prev.options.filter((_, i) => i !== index);
      return {
        ...prev,
        options,
        activeOptionIndex: Math.max(0, Math.min(prev.activeOptionIndex, options.length - 1)),
      };
    });
  }, []);

  const duplicateOption = useCallback((index: number) => {
    setDraft((prev) => {
      const source = prev.options[index];
      if (!source) return prev;
      const copy = {
        ...cloneDraft({ ...createEmptyDraft(), options: [source] }).options[0],
        id: crypto.randomUUID(),
        title: `${source.title} Copy`,
      };
      const options = [...prev.options, copy];
      return {
        ...prev,
        options,
        activeOptionIndex: options.length - 1,
      };
    });
  }, []);

  const addRoute = useCallback(() => {
    updateActiveOption({
      routes: [...activeOption.routes, createRouteRow()],
    });
  }, [activeOption.routes, updateActiveOption]);

  const removeRoute = useCallback(
    (routeId: string) => {
      if (activeOption.routes.length <= 1) return;
      updateActiveOption({
        routes: activeOption.routes.filter((route) => route.id !== routeId),
      });
    },
    [activeOption.routes, updateActiveOption],
  );

  const updateRoute = useCallback(
    (routeId: string, patch: Partial<TQuotationRoute>) => {
      updateActiveOption({
        routes: activeOption.routes.map((route) =>
          route.id === routeId ? { ...route, ...patch } : route,
        ),
      });
    },
    [activeOption.routes, updateActiveOption],
  );

  const parseFlightItinerary = useCallback(async () => {
    const rawText = activeOption.rawItinerary.trim();
    if (!rawText) {
      updateActiveOption({ flightSegments: [] });
      return;
    }

    try {
      const res = await parseItinerary({
        rawText,
        options: { timeFormat: "24h", showOperatedBy: true },
      }).unwrap();

      updateActiveOption({
        flightSegments: mapSegmentsToQuotation(res.data.segments),
      });

      if (res.data.errors.length > 0) {
        toast.error(res.data.errors[0]?.message ?? "Could not parse itinerary.");
      } else if (res.data.warnings.length > 0) {
        toast.warning(`Parsed with ${res.data.warnings.length} warning(s).`);
      }
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Could not parse itinerary."));
    }
  }, [activeOption.rawItinerary, parseItinerary, updateActiveOption]);

  const setTemplateId = useCallback((templateId: TQuotationTemplateId) => {
    updateDraft({ templateId });
  }, [updateDraft]);

  const saveQuotation = useCallback(() => {
    const parsed = quotationCalculatorSaveSchema.safeParse({
      customerName: draft.customerName,
      customerNumber: draft.customerNumber,
      options: draft.options,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid quotation data.");
      return;
    }

    saveDraftToStorage(storageKey, draft);
    toast.success("Quotation saved locally.", {
      description: "Backend persistence will connect when the API is ready.",
    });
  }, [draft, storageKey]);

  const exportImage = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const name = draft.customerName.trim() || "customer";
      await exportQuotationAsImage(
        previewRef.current,
        `quotation-${name.replace(/\s+/g, "-").toLowerCase()}.png`,
      );
      toast.success("Image downloaded.");
    } catch {
      toast.error("Could not export image.");
    }
  }, [draft.customerName]);

  const exportPdf = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      const name = draft.customerName.trim() || "customer";
      await exportQuotationAsPdf(
        previewRef.current,
        `quotation-${name.replace(/\s+/g, "-").toLowerCase()}.pdf`,
      );
      toast.success("PDF downloaded.");
    } catch {
      toast.error("Could not export PDF.");
    }
  }, [draft.customerName]);

  return {
    draft,
    activeOption,
    activeTotals,
    activeOptionIndex: draft.activeOptionIndex,
    isPreviewOpen,
    isParsingFlight,
    previewRef,
    updateDraft,
    updateActiveOption,
    setActiveOptionIndex,
    addOption,
    removeOption,
    duplicateOption,
    addRoute,
    removeRoute,
    updateRoute,
    parseFlightItinerary,
    setTemplateId,
    saveQuotation,
    openPreview: () => setIsPreviewOpen(true),
    closePreview: () => setIsPreviewOpen(false),
    exportImage,
    exportPdf,
  };
}
