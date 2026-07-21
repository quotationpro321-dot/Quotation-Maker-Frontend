"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import { calculateOptionTotals } from "@/features/quotations/calculator/lib/calculate-quotation";
import { mapSegmentsToQuotation } from "@/features/quotations/calculator/lib/map-flight-segments";
import {
  createEmptyDraft,
  createDefaultHotels,
  createInitialOption,
  createOptionFromPrevious,
  createRouteRow,
} from "@/features/quotations/calculator/lib/quotation-calculator-defaults";
import { normalizeCustomIncludedServices } from "@/features/quotations/calculator/lib/quotation-custom-included-services";
import { getFlightItineraryMode } from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import { getDefaultIncludedServices } from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import {
  getStorageKey,
  clearDraftFromStorage,
  loadDraftFromStorage,
  saveDraftToStorage,
} from "@/features/quotations/calculator/lib/quotation-calculator-storage";
import {
  prepareDraftForSave,
  quotationDetailToDraft,
} from "@/features/quotations/lib/quotation-api-mapper";
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
import { runWithLoadingFeedback } from "@/lib/run-with-loading-feedback";
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
import {
  useCreateQuotationMutation,
  useGetQuotationDetailQuery,
  useUpdateQuotationMutation,
} from "@/redux/api/quotations.api";
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

type TLegacyQuotationOption = TQuotationOption & {
  hotelMakkah?: Partial<TQuotationHotel>;
  hotelMadinah?: Partial<TQuotationHotel>;
  hotelHoliday?: Partial<TQuotationHotel>;
};

function resolveHotels(option: TLegacyQuotationOption): TQuotationHotel[] {
  if (Array.isArray(option.hotels) && option.hotels.length > 0) {
    return option.hotels.map((hotel) => normalizeHotel(hotel, { location: "" }));
  }

  const legacyHotels = [
    option.hotelMakkah,
    option.hotelMadinah,
    option.hotelHoliday,
  ].filter((hotel): hotel is Partial<TQuotationHotel> => Boolean(hotel));

  if (legacyHotels.length > 0) {
    return legacyHotels.map((hotel) => normalizeHotel(hotel, { location: "" }));
  }

  return createDefaultHotels();
}

function normalizeIncludedServices(
  services: Partial<TQuotationOption["includedServices"]> | undefined,
  calculatorType: TQuotationCalculatorType,
): TQuotationOption["includedServices"] {
  const defaults = getDefaultIncludedServices(calculatorType);

  if (calculatorType === "holiday") {
    return { ...defaults };
  }

  return {
    guide: services?.guide ?? defaults.guide,
    ziyarah: services?.ziyarah ?? defaults.ziyarah,
    train: services?.train ?? defaults.train,
    manager: services?.manager ?? defaults.manager,
    esim: services?.esim ?? defaults.esim,
  };
}

function normalizeOption(
  option: TQuotationOption,
  calculatorType: TQuotationCalculatorType,
): TQuotationOption {
  return {
    ...option,
    flightSegments: option.flightSegments.map(normalizeFlightSegment),
    includedServices: normalizeIncludedServices(
      option.includedServices,
      calculatorType,
    ),
    customIncludedServices: normalizeCustomIncludedServices(
      option.customIncludedServices,
    ),
    vehicleName: option.vehicleName ?? "",
    vehicleQuantity:
      (option.vehicleQuantity ?? 0) > 0 ? option.vehicleQuantity : 1,
    hotels: resolveHotels(option),
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
  calculatorType: TQuotationCalculatorType,
): TQuotationCalculatorTypeState {
  return {
    activeOptionIndex: state.activeOptionIndex ?? 0,
    options: withSequentialOptionTitles(state.options).map((option) =>
      normalizeOption(option, calculatorType),
    ),
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
    umrah: normalizeCalculatorTypeState(calculatorStates.umrah, "umrah"),
    holiday: normalizeCalculatorTypeState(calculatorStates.holiday, "holiday"),
    flights: normalizeCalculatorTypeState(calculatorStates.flights, "flights"),
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isNewQuotation = searchParams.get("new") === "1";

  const [draft, setDraft] = useState<TQuotationDraft>(() => createEmptyDraft());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSharingLink, setIsSharingLink] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isSavingQuotation, setIsSavingQuotation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const isExportingPdfRef = useRef(false);
  const isSavingQuotationRef = useRef(false);
  const skipDraftRestoreRef = useRef(false);
  const { consultantName, consultantWhatsapp, consultantDesignation } = useQuotationConsultantName();

  const [parseItinerary, { isLoading: isParsingFlight }] =
    useParseItineraryMutation();
  const [createQuotation] = useCreateQuotationMutation();
  const [updateQuotation] = useUpdateQuotationMutation();

  const {
    data: detailResponse,
    isLoading: isLoadingDetail,
    isError: isDetailError,
    error: detailError,
  } = useGetQuotationDetailQuery(editId ?? "", {
    skip: !editId,
  });

  const storageKey = getStorageKey(expectedRole, editId);
  const newDraftStorageKey = getStorageKey(expectedRole, null);

  const activeCalculatorState = getCalculatorTypeState(draft);
  const activeOptions = activeCalculatorState.options;
  const activeOptionIndex = activeCalculatorState.activeOptionIndex;

  useEffect(() => {
    if (editId) {
      if (detailResponse?.data) {
        const loaded = normalizeDraft(quotationDetailToDraft(detailResponse.data));
        setDraft(loaded);
        setIsPreviewOpen(false);
        setIsInitialized(true);
        return;
      }

      if (isLoadingDetail) {
        setIsInitialized(false);
        return;
      }

      if (isDetailError) {
        toast.error(
          extractApiErrorMessage(detailError, "Could not load quotation."),
        );
        const fromStorage = loadDraftFromStorage(storageKey);
        setDraft(normalizeDraft(fromStorage ?? createEmptyDraft()));
        setIsInitialized(true);
        return;
      }

      return;
    }

    if (isNewQuotation) {
      clearDraftFromStorage(newDraftStorageKey);
      skipDraftRestoreRef.current = true;
      setDraft(normalizeDraft(createEmptyDraft()));
      setIsPreviewOpen(false);
      setIsInitialized(true);
      router.replace(pathname);
      return;
    }

    if (skipDraftRestoreRef.current) {
      skipDraftRestoreRef.current = false;
      setIsInitialized(true);
      return;
    }

    const fromStorage = loadDraftFromStorage(newDraftStorageKey);
    if (fromStorage && !fromStorage.id) {
      setDraft(normalizeDraft(fromStorage));
    } else {
      setDraft(normalizeDraft(createEmptyDraft()));
    }
    setIsPreviewOpen(false);
    setIsInitialized(true);
  }, [
    detailError,
    detailResponse,
    editId,
    isDetailError,
    isLoadingDetail,
    isNewQuotation,
    newDraftStorageKey,
    pathname,
    router,
    storageKey,
  ]);

  useEffect(() => {
    if (!isInitialized) return;
    if (editId && draft.id !== editId) return;
    if (!editId && draft.id) return;

    const timeoutId = window.setTimeout(() => {
      saveDraftToStorage(storageKey, draft);
    }, 800);
    return () => window.clearTimeout(timeoutId);
  }, [draft, draft.id, editId, isInitialized, storageKey]);

  const activeOption = activeOptions[activeOptionIndex] ?? activeOptions[0];
  const activeTotals = useMemo(
    () => calculateOptionTotals(activeOption, draft.calculatorType),
    [activeOption, draft.calculatorType],
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
          : createInitialOption("Option 1", prev.calculatorType);
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
    const lastRoute = activeOption.routes.at(-1);
    const nextRoute = createRouteRow();

    if (lastRoute?.to) {
      nextRoute.from = lastRoute.to;
    }

    updateActiveOption({
      routes: [...activeOption.routes, nextRoute],
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
      const routeIndex = activeOption.routes.findIndex(
        (route) => route.id === routeId,
      );
      if (routeIndex === -1) return;

      const routes = activeOption.routes.map((route, index) => {
        if (route.id === routeId) {
          return { ...route, ...patch };
        }

        if (patch.to !== undefined && index === routeIndex + 1) {
          return { ...route, from: patch.to };
        }

        return route;
      });

      updateActiveOption({ routes });
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

  const saveQuotation = useCallback(async () => {
    const parsed = quotationCalculatorSaveSchema.safeParse({
      customerName: draft.customerName,
      customerNumber: draft.customerNumber,
      options: activeOptions,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Invalid quotation data.");
      return;
    }

    const payload = prepareDraftForSave(draft);

    await runWithLoadingFeedback({
      guardRef: isSavingQuotationRef,
      setLoading: setIsSavingQuotation,
      loadingMessage: "Saving quotation…",
      successMessage: "Quotation saved.",
      errorMessage: "Could not save quotation.",
      run: async () => {
        try {
          if (draft.id) {
            const response = await updateQuotation({
              id: draft.id,
              body: { ...payload, id: draft.id, referenceNumber: draft.referenceNumber },
            }).unwrap();
            const saved = response.data;
            const nextDraft = normalizeDraft({
              ...draft,
              ...quotationDetailToDraft(saved),
            });
            setDraft(nextDraft);
            saveDraftToStorage(getStorageKey(expectedRole, saved.id), nextDraft);
            return;
          }

          const response = await createQuotation(payload).unwrap();
          const saved = response.data;
          const nextDraft = normalizeDraft(quotationDetailToDraft(saved));
          setDraft(nextDraft);
          clearDraftFromStorage(newDraftStorageKey);
          saveDraftToStorage(getStorageKey(expectedRole, saved.id), nextDraft);
          router.replace(`${pathname}?id=${encodeURIComponent(saved.id)}`);
        } catch (error) {
          throw new Error(
            extractApiErrorMessage(error, "Could not save quotation."),
          );
        }
      },
    });
  }, [
    activeOptions,
    draft,
    expectedRole,
    newDraftStorageKey,
    pathname,
    router,
    createQuotation,
    updateQuotation,
  ]);

  const exportPdf = useCallback(async () => {
    const element = previewRef.current;
    if (!element) return;

    const filename = `quotation-${(draft.customerName.trim() || "customer").replace(/\s+/g, "-").toLowerCase()}.pdf`;

    await runWithLoadingFeedback({
      guardRef: isExportingPdfRef,
      setLoading: setIsExportingPdf,
      loadingMessage: "Preparing your PDF…",
      successMessage: "PDF downloaded.",
      errorMessage: "Could not export PDF.",
      run: () => exportQuotationAsPdf(element, filename),
    });
  }, [draft.customerName]);

  const shareLink = useCallback(async () => {
    setIsSharingLink(true);
    try {
      await copyQuotationShareLink(draft, activeOptionIndex, {
        name: consultantName,
        whatsapp: consultantWhatsapp,
        designation: consultantDesignation,
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
  }, [activeOptionIndex, consultantDesignation, consultantName, consultantWhatsapp, draft]);

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
    isExportingPdf,
    isSavingQuotation,
    isLoadingDetail: Boolean(editId && isLoadingDetail),
    isInitialized,
  };
}
