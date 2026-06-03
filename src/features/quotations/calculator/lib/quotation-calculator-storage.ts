import type { TQuotationDraft, TQuotationDetail } from "@/types/quotation.type";

import { createEmptyDraft, createInitialOption } from "./quotation-calculator-defaults";
import { createEmptyCalculatorStates } from "./quotation-calculator-type-state";

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
          city: "Makkah",
          country: "Saudi Arabia",
          location: "Makkah",
          areaSlug: "makkah",
          distance: "5-7 Minutes",
          checkIn: "10 Dec 2025",
          checkOut: "15 Dec 2025",
          roomType: "Double",
          board: "Half-Board",
          cost: 850,
        },
        hotelMadinah: {
          name: "Anwar Al Madinah Movenpick Hotel",
          city: "Madinah",
          country: "Saudi Arabia",
          location: "Madinah",
          areaSlug: "madinah",
          distance: "0-1 Minutes",
          checkIn: "15 Dec 2025",
          checkOut: "20 Dec 2025",
          roomType: "Twin",
          board: "Bed & Breakfast",
          cost: 620,
        },
        flightAdult: 725,
        numPax: 2,
        markupPerPerson: 150,
        transferCost: 180,
        vehicleName: "Hyundai H1",
        vehicleQuantity: 2,
        routes: [
          {
            id: "route-mock-1",
            from: "Jeddah Airport",
            to: "Makkah Hotel",
          },
          {
            id: "route-mock-2",
            from: "Makkah Hotel",
            to: "Madinah Hotel",
          },
        ],
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
          name: "Pullman Zamzam",
          city: "Makkah",
          country: "Saudi Arabia",
          location: "Makkah",
          areaSlug: "makkah",
          distance: "1-2 Minutes",
          checkIn: "01 Jan 2026",
          checkOut: "08 Jan 2026",
          roomType: "Deluxe",
          board: "Full-Board",
          cost: 1200,
        },
        hotelMadinah: {
          name: "Pullman Zamzam Madinah",
          city: "Madinah",
          country: "Saudi Arabia",
          location: "Madinah",
          areaSlug: "madinah",
          distance: "2-3 Minutes",
          checkIn: "08 Jan 2026",
          checkOut: "14 Jan 2026",
          roomType: "Deluxe",
          board: "Full-Board",
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

  const calculatorType = detail.calculatorType ?? "umrah";
  const calculatorStates = createEmptyCalculatorStates();
  calculatorStates[calculatorType] = {
    options: detail.options,
    activeOptionIndex: 0,
  };

  return {
    id: detail.id,
    referenceNumber: detail.referenceNumber,
    customerName: detail.customerName,
    customerNumber: detail.customerNumber ?? detail.customerPhone ?? "",
    calculatorType,
    quotationDate: detail.quotationDate,
    status: detail.status,
    currency: detail.currency,
    templateId: detail.templateId,
    calculatorStates,
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
