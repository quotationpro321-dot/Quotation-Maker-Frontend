"use client";

import { useState } from "react";

import { AIRLINE_LOGO_MAX_HEIGHT } from "@/features/flight-converter/lib/itinerary-table-layout";
import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";

type AirlineLogoProps = {
  segment: NormalizedSegment;
  /** Override the default cap (e.g. compact PDF cells). */
  maxHeightPx?: number;
};

export function AirlineLogo({
  segment,
  maxHeightPx = AIRLINE_LOGO_MAX_HEIGHT,
}: AirlineLogoProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="export-airline-logo-fallback flex w-full min-h-10 flex-col items-center justify-center px-1 text-center text-foreground">
        <span className="mb-0.5 block text-[9px] font-bold uppercase leading-tight tracking-tighter text-muted-foreground">
          {segment.airlineName}
        </span>
        <span className="text-base font-black leading-none">
          {segment.airlineCode}
        </span>
      </div>
    );
  }

  return (
    <div className="export-airline-logo-wrap flex w-full max-w-full items-center justify-center px-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={segment.airlineLogoUrl}
        alt={segment.airlineName}
        crossOrigin="anonymous"
        data-export-airline-logo
        className="export-airline-logo block h-auto w-auto max-w-full object-contain"
        style={{
          maxHeight: maxHeightPx,
          maxWidth: "100%",
          width: "auto",
          height: "auto",
          objectFit: "contain",
        }}
        onError={() => setError(true)}
      />
    </div>
  );
}
