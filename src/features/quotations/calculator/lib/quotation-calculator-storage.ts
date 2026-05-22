import type { TQuotationDraft, TQuotationDetail } from "@/types/quotation.type";

import { createEmptyDraft, createInitialOption } from "./quotation-calculator-defaults";

const MOCK_DETAILS: Record<string, TQuotationDetail> = {
  "q-1": {
    id: "q-1",
    referenceNumber: 1,
    customerName: "Abdullah Rahman",
    customerPhone: "+44 7700 900101",
    customerNumber: "+44 7700 900101",
    quotationDate: "2025-11-10T10:00:00.000Z",
    makkahHotel: "Hilton Makkah Convention Hotel",
    madinahHotel: "Anwar Al Madinah Movenpick Hotel",
    status: "pending",
    createdBy: { id: "user-emp-1", name: "Ahmed Chowdhury" },
    totalValue: 2495,
    currency: "GBP",
    templateId: "classic",
    options: [
      {
        ...createInitialOption("Option 1"),
        hotelMakkah: {
          name: "Hilton Makkah Convention Hotel",
          roomType: "Double",
          cost: 850,
        },
        hotelMadinah: {
          name: "Anwar Al Madinah Movenpick Hotel",
          roomType: "Twin",
          cost: 620,
        },
        flightAdult: 725,
        numPax: 2,
        markupPerPerson: 150,
      },
    ],
  },
  "q-4": {
    id: "q-4",
    referenceNumber: 4,
    customerName: "Sarah Ahmed",
    customerNumber: "",
    quotationDate: "2025-11-07T11:00:00.000Z",
    makkahHotel: "Pullman Zamzam Makkah",
    madinahHotel: "Pullman Zamzam Madinah",
    status: "confirmed",
    createdBy: { id: "user-admin-1", name: "Admin User" },
    totalValue: 5200,
    currency: "GBP",
    templateId: "modern",
    options: [
      {
        ...createInitialOption("Option 1"),
        hotelMakkah: {
          name: "Pullman Zamzam Makkah",
          roomType: "Deluxe",
          cost: 1200,
        },
        hotelMadinah: {
          name: "Pullman Zamzam Madinah",
          roomType: "Deluxe",
          cost: 980,
        },
        flightAdult: 1450,
        numPax: 3,
        markupPerPerson: 200,
      },
    ],
  },
};

export function loadMockQuotationDetail(id: string): TQuotationDraft | null {
  const detail = MOCK_DETAILS[id];
  if (!detail) return null;

  return {
    id: detail.id,
    referenceNumber: detail.referenceNumber,
    customerName: detail.customerName,
    customerNumber: detail.customerNumber ?? detail.customerPhone ?? "",
    quotationDate: detail.quotationDate,
    status: detail.status,
    currency: detail.currency,
    templateId: detail.templateId,
    options: detail.options,
    activeOptionIndex: 0,
  };
}

export function saveDraftToStorage(
  key: string,
  draft: TQuotationDraft,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(draft));
}

export function loadDraftFromStorage(key: string): TQuotationDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TQuotationDraft;
  } catch {
    return null;
  }
}

export function clearDraftFromStorage(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function getStorageKey(role: "admin" | "employee", editId?: string | null) {
  if (editId) return `quotation-draft-${editId}`;
  return `quotation-draft-new-${role}`;
}

export function draftFromEmpty(): TQuotationDraft {
  return createEmptyDraft();
}
