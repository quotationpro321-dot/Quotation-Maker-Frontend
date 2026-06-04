"use client";

import { useEffect, useRef, useState } from "react";

import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

const PAGE_GAP_PX = 24;
const PAGE_COUNT = 2;
const TOTAL_CONTENT_HEIGHT =
  QUOTATION_A4_HEIGHT_PX * PAGE_COUNT + PAGE_GAP_PX * (PAGE_COUNT - 1);

type TQuotationPagedPreviewScalerProps = {
  children: React.ReactNode;
};

export function QuotationPagedPreviewScaler({
  children,
}: TQuotationPagedPreviewScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) return;
      setScale(Math.min(1, availableWidth / QUOTATION_A4_WIDTH_PX));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const scaledWidth = QUOTATION_A4_WIDTH_PX * scale;
  const scaledHeight = TOTAL_CONTENT_HEIGHT * scale;

  return (
    <div ref={containerRef} className="w-full min-w-0">
      <div
        className="mx-auto overflow-hidden rounded! shadow-md ring-1 ring-border/60"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div
          className="bg-muted/20"
          style={{
            width: QUOTATION_A4_WIDTH_PX,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
