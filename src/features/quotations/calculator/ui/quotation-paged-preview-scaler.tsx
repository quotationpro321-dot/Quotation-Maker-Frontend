"use client";

import { useEffect, useRef, useState } from "react";

import { QUOTATION_A4_WIDTH_PX } from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

type TQuotationPagedPreviewScalerProps = {
  children: React.ReactNode;
};

/**
 * Scales fixed A4 pages down to the available width. Content height is
 * measured live, so the page count can vary per quotation.
 */
export function QuotationPagedPreviewScaler({
  children,
}: TQuotationPagedPreviewScalerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const update = () => {
      const availableWidth = container.clientWidth;
      if (availableWidth > 0) {
        setScale(Math.min(1, availableWidth / QUOTATION_A4_WIDTH_PX));
      }
      setContentHeight(content.offsetHeight);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const scaledWidth = QUOTATION_A4_WIDTH_PX * scale;
  const scaledHeight = contentHeight * scale;

  return (
    <div ref={containerRef} className="w-full min-w-0">
      <div
        className="mx-auto overflow-hidden"
        style={{ width: scaledWidth, height: scaledHeight }}
      >
        <div
          ref={contentRef}
          className="bg-transparent"
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
