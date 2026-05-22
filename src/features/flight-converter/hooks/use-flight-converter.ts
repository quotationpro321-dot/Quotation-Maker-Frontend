"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { extractApiErrorMessage } from "@/features/auth/lib/extract-api-error-message";
import {
  EXAMPLE_BG_ITINERARY,
  EXAMPLE_EK_ITINERARY,
  EXAMPLE_QR_ITINERARY,
  EXAMPLE_SV_ITINERARY,
} from "@/features/flight-converter/lib/examples";
import {
  copyElementHtml,
  exportElementAsImage,
  exportElementAsPdf,
} from "@/features/flight-converter/lib/export-itinerary";
import type {
  NormalizedSegment,
  ParseItineraryResponse,
  TimeFormat,
} from "@/features/flight-converter/types/flight-converter.types";
import { useParseItineraryMutation } from "@/redux/api/flight-converter.api";
import { flightConverterInputSchema } from "@/validation/flight-converter.schema";

function cloneSegments(segments: NormalizedSegment[]): NormalizedSegment[] {
  return segments.map((s) => ({ ...s }));
}

export function useFlightConverter() {
  const [rawText, setRawText] = useState("");
  const [parseResult, setParseResult] = useState<ParseItineraryResponse | null>(
    null,
  );
  const [editableSegments, setEditableSegments] = useState<NormalizedSegment[]>(
    [],
  );
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("24h");
  const [validationError, setValidationError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [parseItinerary, { isLoading }] = useParseItineraryMutation();

  const handleConvert = useCallback(async () => {
    setValidationError(null);

    const parsed = flightConverterInputSchema.safeParse({ rawText });
    if (!parsed.success) {
      const msg = parsed.error.errors[0]?.message ?? "Invalid input.";
      setValidationError(msg);
      toast.error(msg);
      return;
    }

    try {
      const res = await parseItinerary({
        rawText: parsed.data.rawText,
        options: { timeFormat, showOperatedBy: true },
      }).unwrap();

      const data = res.data;
      setParseResult(data);
      setEditableSegments(cloneSegments(data.segments));

      if (data.errors.length > 0) {
        toast.error(data.errors[0].message);
      } else if (data.warnings.length > 0) {
        toast.warning(`Parsed with ${data.warnings.length} warning(s).`);
      } else {
        toast.success(res.message);
      }
    } catch (err) {
      const msg = extractApiErrorMessage(err, "Could not parse itinerary.");
      setValidationError(msg);
      toast.error(msg);
    }
  }, [parseItinerary, rawText, timeFormat]);

  const handleClear = useCallback(() => {
    setRawText("");
    setParseResult(null);
    setEditableSegments([]);
    setValidationError(null);
  }, []);

  const loadExample = useCallback((example: "qr" | "bg" | "ek" | "sv") => {
    const textByExample = {
      qr: EXAMPLE_QR_ITINERARY,
      bg: EXAMPLE_BG_ITINERARY,
      ek: EXAMPLE_EK_ITINERARY,
      sv: EXAMPLE_SV_ITINERARY,
    } as const;
    setRawText(textByExample[example]);
    setParseResult(null);
    setEditableSegments([]);
    setValidationError(null);
  }, []);

  const updateSegment = useCallback(
    (index: number, patch: Partial<NormalizedSegment>) => {
      setEditableSegments((prev) =>
        prev.map((seg, i) => (i === index ? { ...seg, ...patch } : seg)),
      );
    },
    [],
  );

  const handleCopy = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      await copyElementHtml(previewRef.current);
      toast.success("Itinerary copied to clipboard.");
    } catch {
      toast.error("Could not copy itinerary.");
    }
  }, []);

  const handleExportImage = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      await exportElementAsImage(previewRef.current, "flight-itinerary.png");
      toast.success("Image downloaded.");
    } catch (err) {
      console.error("Export image failed:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not export image. Try again.",
      );
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    if (!previewRef.current) return;
    try {
      await exportElementAsPdf(previewRef.current, "flight-itinerary.pdf");
      toast.success("PDF downloaded.");
    } catch (err) {
      console.error("Export PDF failed:", err);
      toast.error(
        err instanceof Error ? err.message : "Could not export PDF. Try again.",
      );
    }
  }, []);

  return {
    rawText,
    setRawText,
    parseResult,
    editableSegments,
    timeFormat,
    setTimeFormat,
    validationError,
    previewRef,
    isLoading,
    handleConvert,
    handleClear,
    loadExample,
    updateSegment,
    handleCopy,
    handleExportImage,
    handleExportPdf,
    hasPreview: editableSegments.length > 0,
  };
}
