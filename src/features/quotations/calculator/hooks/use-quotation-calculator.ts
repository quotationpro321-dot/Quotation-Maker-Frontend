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
  createOptionFromPrevious,
  createRouteRow,
} from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import { normalizeCustomIncludedServices } from "@/features/quotations/calculator/lib/quotation-custom-included-services";
import { getFlightItineraryMode } from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import { DEFAULT_INCLUDED_SERVICES } from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import {
  getStorageKey,
  loadDraftFromStorage,
  loadMockQuotationDetail,
  saveDraftToStorage,
} from "@/features/quotations/calculator/lib/quotation-calculator-storage";
import {
  getCalculatorTypeState,
  hasLegacyFlatOptions,
  migrateLegacyDraftToCalculatorStates,
  updateActiveCalculatorTypeState,
} from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import {
  exportQuotationAsPdf,
} from "@/features/quotations/calculator/lib/export-quotation";
import { copyQuotationShareLink } from "@/features/quotations/calculator/lib/quotation-share";
import { useQuotationConsultantName } from "@/features/quotations/calculator/hooks/use-quotation-consultant-name";
import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";
import type {
  TQuotationCalculatorType,
  TQuotationCalculatorTypeState,
  TQuotationDraft,
  TQuotationHotel,
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

function withSequentialOptionTitles(options: TQuotationOption[]): TQuotationOption[] {
  return options.map((option, index) => ({
    ...option,
    title: `Option ${index + 1}`,
  }));
}

function normalizeFlightSegment(
  segment: TQuotationOption["flightSegments"][number],
): NormalizedSegment {
  return {
    ...segment,
    cabinType: segment.cabinType ?? "",
    departureDate: segment.departureDate ?? "",
    arrivalDate: segment.arrivalDate ?? "",
    arrivalDateDisplay: segment.arrivalDateDisplay ?? segment.arrivalDisplay,
    durationMinutes: segment.durationMinutes ?? null,
    durationDisplay: segment.durationDisplay || "-",
    transitMinutes: segment.transitMinutes ?? null,
    transitDisplay: segment.transitDisplay || "-",
    terminalDepart: segment.terminalDepart ?? "",
    terminalArrive: segment.terminalArrive ?? "",
    parseConfidence: segment.parseConfidence ?? "high",
    sourceLine: segment.sourceLine ?? "",
  };
}

function normalizeHotel(
  hotel: Partial<TQuotationHotel> | undefined,
  defaults: { location: string; areaSlug?: string },
): TQuotationHotel {
  return {
    name: hotel?.name ?? "",
    city: hotel?.city ?? "",
    country: hotel?.country ?? "",
    location: hotel?.location || defaults.location,
    areaSlug: hotel?.areaSlug ?? defaults.areaSlug,
    distance: hotel?.distance ?? "",
    checkIn: hotel?.checkIn ?? "",
    checkOut: hotel?.checkOut ?? "",
    roomType: hotel?.roomType ?? "",
    board: hotel?.board ?? "",
    cost: hotel?.cost ?? 0,
  };
}

function normalizeIncludedServices(
  services: Partial<TQuotationOption["includedServices"]> | undefined,
): TQuotationOption["includedServices"] {
  return {
    guide: services?.guide ?? DEFAULT_INCLUDED_SERVICES.guide,
    ziyarah: services?.ziyarah ?? DEFAULT_INCLUDED_SERVICES.ziyarah,
    train: services?.train ?? DEFAULT_INCLUDED_SERVICES.train,
    manager: services?.manager ?? DEFAULT_INCLUDED_SERVICES.manager,
    esim: services?.esim ?? DEFAULT_INCLUDED_SERVICES.esim,
  };
}

function normalizeOption(option: TQuotationOption): TQuotationOption {
  return {
    ...option,
    flightSegments: option.flightSegments.map(normalizeFlightSegment),
    includedServices: normalizeIncludedServices(option.includedServices),
    customIncludedServices: normalizeCustomIncludedServices(
      option.customIncludedServices,
    ),
    vehicleName: option.vehicleName ?? "",
    vehicleQuantity:
      (option.vehicleQuantity ?? 0) > 0 ? option.vehicleQuantity : 1,
    hotelMakkah: normalizeHotel(option.hotelMakkah, { location: "" }),
    hotelMadinah: normalizeHotel(option.hotelMadinah, { location: "" }),
    hotelHoliday: normalizeHotel(option.hotelHoliday, { location: "" }),
    flightSectionEnabled: option.flightSectionEnabled ?? true,
    hotelSectionEnabled: option.hotelSectionEnabled ?? true,
    visaSectionEnabled: option.visaSectionEnabled ?? true,
    transferSectionEnabled: option.transferSectionEnabled ?? true,
    officeNoteSectionEnabled: option.officeNoteSectionEnabled ?? true,
    customerNoteSectionEnabled: option.customerNoteSectionEnabled ?? true,
    flightItineraryMode:
      option.flightItineraryMode === "image" ? "image" : "text",
    flightItineraryImage: option.flightItineraryImage ?? "",
  };
}

function normalizeCalculatorTypeState(
  state: TQuotationCalculatorTypeState,
): TQuotationCalculatorTypeState {
  return {
    activeOptionIndex: state.activeOptionIndex ?? 0,
    options: withSequentialOptionTitles(state.options).map(normalizeOption),
  };
}

function normalizeDraft(draft: TQuotationDraft): TQuotationDraft {
  const emptyStates = createEmptyDraft().calculatorStates;
  const calculatorStates = hasLegacyFlatOptions(draft)
    ? migrateLegacyDraftToCalculatorStates(draft)
    : {
        umrah: draft.calculatorStates?.umrah ?? emptyStates.umrah,
        holiday: draft.calculatorStates?.holiday ?? emptyStates.holiday,
        flights: draft.calculatorStates?.flights ?? emptyStates.flights,
      };

  const normalizedStates = {
    umrah: normalizeCalculatorTypeState(calculatorStates.umrah),
    holiday: normalizeCalculatorTypeState(calculatorStates.holiday),
    flights: normalizeCalculatorTypeState(calculatorStates.flights),
  };

  const calculatorType = draft.calculatorType ?? "umrah";

  return {
    ...draft,
    calculatorType,
    calculatorStates: normalizedStates,
  };
}

export function useQuotationCalculator({
  expectedRole,
}: TUseQuotationCalculatorOptions) {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [draft, setDraft] = useState<TQuotationDraft>(() => createEmptyDraft());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSharingLink, setIsSharingLink] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { consultantName, consultantWhatsapp } = useQuotationConsultantName();

  const [parseItinerary, { isLoading: isParsingFlight }] =
    useParseItineraryMutation();

  const storageKey = getStorageKey(expectedRole, editId);

  const activeCalculatorState = getCalculatorTypeState(draft);
  const activeOptions = activeCalculatorState.options;
  const activeOptionIndex = activeCalculatorState.activeOptionIndex;

  useEffect(() => {
    const fromMock = editId ? loadMockQuotationDetail(editId) : null;
    const fromStorage = loadDraftFromStorage(storageKey);
    const initial = normalizeDraft(fromMock ?? fromStorage ?? createEmptyDraft());
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

  const activeOption = activeOptions[activeOptionIndex] ?? activeOptions[0];
  const activeTotals = useMemo(
    () => calculateOptionTotals(activeOption),
    [activeOption],
  );

  const updateDraft = useCallback((patch: Partial<TQuotationDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateActiveOption = useCallback((patch: Partial<TQuotationOption>) => {
    setDraft((prev) =>
      updateActiveCalculatorTypeState(prev, (state) => ({
        ...state,
        options: state.options.map((option, index) =>
          index === state.activeOptionIndex ? { ...option, ...patch } : option,
        ),
      })),
    );
  }, []);

  const setActiveOptionIndex = useCallback((index: number) => {
    setDraft((prev) =>
      updateActiveCalculatorTypeState(prev, (state) => ({
        ...state,
        activeOptionIndex: index,
      })),
    );
  }, []);

  const addOption = useCallback(() => {
    setDraft((prev) =>
      updateActiveCalculatorTypeState(prev, (state) => {
        const source =
          state.options[state.activeOptionIndex] ??
          state.options[state.options.length - 1];
        const newOption = source
          ? createOptionFromPrevious(source)
          : createInitialOption();
        const options = withSequentialOptionTitles([...state.options, newOption]);
        return {
          options,
          activeOptionIndex: options.length - 1,
        };
      }),
    );
  }, []);

  const removeOption = useCallback((index: number) => {
    setDraft((prev) =>
      updateActiveCalculatorTypeState(prev, (state) => {
        if (state.options.length <= 1) return state;
        const options = withSequentialOptionTitles(
          state.options.filter((_, i) => i !== index),
        );
        return {
          options,
          activeOptionIndex: Math.max(
            0,
            Math.min(state.activeOptionIndex, options.length - 1),
          ),
        };
      }),
    );
  }, []);

  const duplicateOption = useCallback((index: number) => {
    setDraft((prev) =>
      updateActiveCalculatorTypeState(prev, (state) => {
        const source = state.options[index];
        if (!source) return state;
        const copy = createOptionFromPrevious(source);
        const options = withSequentialOptionTitles([...state.options, copy]);
        return {
          options,
          activeOptionIndex: options.length - 1,
        };
      }),
    );
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
    if (getFlightItineraryMode(activeOption) === "image") return;

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
  }, [
    activeOption.flightItineraryMode,
    activeOption.rawItinerary,
    parseItinerary,
    updateActiveOption,
  ]);

  const setTemplateId = useCallback((templateId: TQuotationTemplateId) => {
    updateDraft({ templateId });
  }, [updateDraft]);

  const setCalculatorType = useCallback(
    (calculatorType: TQuotationCalculatorType) => {
      setDraft((prev) => ({ ...prev, calculatorType }));
    },
    [],
  );

  const saveQuotation = useCallback(() => {
    const parsed = quotationCalculatorSaveSchema.safeParse({
      customerName: draft.customerName,
      customerNumber: draft.customerNumber,
      options: activeOptions,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid quotation data.");
      return;
    }

    saveDraftToStorage(storageKey, draft);
    toast.success("Quotation saved locally.", {
      description: "Backend persistence will connect when the API is ready.",
    });
  }, [activeOptions, draft, storageKey]);

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

  const shareLink = useCallback(async () => {
    setIsSharingLink(true);
    try {
      await copyQuotationShareLink(draft, activeOptionIndex, {
        name: consultantName,
        whatsapp: consultantWhatsapp,
      });
      toast.success("Share link copied to clipboard.", {
        description: "Recipients can open the quotation in their browser.",
      });
    } catch (error) {
      if (error instanceof Error && error.message === "QUOTATION_TOO_LARGE") {
        toast.error("Quotation is too large to share as a link.");
        return;
      }
      toast.error("Could not copy share link.");
    } finally {
      setIsSharingLink(false);
    }
  }, [activeOptionIndex, consultantName, consultantWhatsapp, draft]);

  return {
    draft,
    activeOptions,
    activeOption,
    activeTotals,
    activeOptionIndex,
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
    setCalculatorType,
    saveQuotation,
    openPreview: () => setIsPreviewOpen(true),
    closePreview: () => setIsPreviewOpen(false),
    exportPdf,
    shareLink,
    isSharingLink,
  };
}
