"use client";

import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  decodeQuotationShareToken,
  type TQuotationSharePayload,
} from "@/features/quotations/calculator/lib/quotation-share";
import { QuotationTemplatePreview } from "@/features/quotations/calculator/ui/quotation-template-preview";

type TShareViewStatus = "loading" | "invalid" | "ready";

export function QuotationSharedView() {
  const [status, setStatus] = useState<TShareViewStatus>("loading");
  const [payload, setPayload] = useState<TQuotationSharePayload | null>(null);

  useEffect(() => {
    const token = window.location.hash.replace(/^#/, "");
    if (!token) {
      setStatus("invalid");
      return;
    }

    let cancelled = false;
    void decodeQuotationShareToken(token).then((decoded) => {
      if (cancelled) return;
      setPayload(decoded);
      setStatus(decoded ? "ready" : "invalid");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-10 sm:px-8">
        <Skeleton className="h-8 w-64 rounded!" />
        <Skeleton className="h-[60vh] w-full rounded!" />
      </div>
    );
  }

  if (status === "invalid" || !payload) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Quotation link invalid
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This share link is broken or incomplete. Ask the sender for a new
          link.
        </p>
      </div>
    );
  }

  const customerLabel = payload.draft.customerName.trim() || "Quotation";

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-4 py-4 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Shared quotation
        </p>
        <h1 className="text-lg font-bold text-foreground">{customerLabel}</h1>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8">
        <QuotationTemplatePreview
          draft={payload.draft}
          activeOptionIndex={payload.activeOptionIndex}
          consultantName={payload.consultantName}
          consultantWhatsapp={payload.consultantWhatsapp}
          className="bg-background"
        />
      </main>
    </div>
  );
}
