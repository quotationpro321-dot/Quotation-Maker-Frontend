import type {
  TListQuotationsParams,
  TQuotationListItem,
  TQuotationsListData,
} from "@/types/quotation.type";

const MOCK_CURRENT_USER_ID = "user-admin-1";
const MOCK_EMPLOYEE_USER_ID = "user-employee-1";


function mockIdentity(referenceNumber: number, id: string) {
  const sequence = String(referenceNumber).padStart(6, "0");
  return {
    refId: `ASASUM${sequence}`,
    readableId: `Alsama > Alsama > umrah ${id}`,
    calculatorType: "umrah" as const,
  };
}

const BASE_QUOTATIONS: TQuotationListItem[] = [
  {
    id: "q-1",
    referenceNumber: 1,
    ...mockIdentity(1, "q-1"),
    customerName: "Abdullah Rahman",
    customerPhone: "+44 7700 900101",
    quotationDate: "2025-11-10T10:00:00.000Z",
    makkahHotel: "Hilton Makkah Convention Hotel",
    madinahHotel: "Anwar Al Madinah Movenpick Hotel",
    status: "pending",
    createdBy: { id: "user-emp-1", name: "Ahmed Chowdhury" },
    totalValue: 2495,
    currency: "GBP",
  },
  {
    id: "q-2",
    referenceNumber: 2,
    ...mockIdentity(2, "q-2"),
    customerName: "Fatima Noor",
    customerPhone: "+44 7700 900102",
    quotationDate: "2025-11-09T14:30:00.000Z",
    makkahHotel: "Swissôtel Makkah",
    madinahHotel: "InterContinental Dar Al Iman",
    status: "confirmed",
    createdBy: { id: "user-emp-2", name: "Hasan Ali" },
    totalValue: 4180,
    currency: "GBP",
  },
  {
    id: "q-3",
    referenceNumber: 3,
    ...mockIdentity(3, "q-3"),
    customerName: "Mohammed Iqbal",
    customerPhone: "+44 7700 900103",
    quotationDate: "2025-11-08T09:15:00.000Z",
    makkahHotel: "Fairmont Makkah",
    madinahHotel: "Hilton Madinah",
    status: "pending",
    createdBy: { id: "user-emp-3", name: "Rafi Uddin" },
    totalValue: 1890,
    currency: "GBP",
  },
  {
    id: "q-4",
    referenceNumber: 4,
    ...mockIdentity(4, "q-4"),
    customerName: "Sarah Ahmed",
    quotationDate: "2025-11-07T11:00:00.000Z",
    makkahHotel: "Pullman Zamzam Makkah",
    madinahHotel: "Pullman Zamzam Madinah",
    status: "confirmed",
    createdBy: { id: MOCK_CURRENT_USER_ID, name: "Admin User" },
    totalValue: 5200,
    currency: "GBP",
  },
  {
    id: "q-5",
    referenceNumber: 5,
    ...mockIdentity(5, "q-5"),
    customerName: "James Wilson",
    quotationDate: "2025-11-06T16:45:00.000Z",
    makkahHotel: "Movenpick Hajar Tower Makkah",
    madinahHotel: "Shaza Al Madinah",
    status: "draft",
    createdBy: { id: MOCK_EMPLOYEE_USER_ID, name: "Nobin Chowdhury" },
    totalValue: 1750,
    currency: "GBP",
  },
  {
    id: "q-6",
    referenceNumber: 6,
    ...mockIdentity(6, "q-6"),
    customerName: "Emma Thompson",
    quotationDate: "2025-11-05T08:20:00.000Z",
    makkahHotel: "Adnan Hotel Makkah",
    madinahHotel: "Anwar Al Madinah Movenpick Hotel",
    status: "cancelled",
    createdBy: { id: "user-emp-1", name: "Ahmed Chowdhury" },
    totalValue: 920,
    currency: "GBP",
  },
  {
    id: "q-7",
    referenceNumber: 7,
    ...mockIdentity(7, "q-7"),
    customerName: "Ali Hassan",
    quotationDate: "2025-11-04T13:10:00.000Z",
    makkahHotel: "Hilton Makkah Convention Hotel",
    madinahHotel: "Hilton Madinah",
    status: "pending",
    createdBy: { id: MOCK_CURRENT_USER_ID, name: "Admin User" },
    totalValue: 3100,
    currency: "GBP",
  },
  {
    id: "q-8",
    referenceNumber: 8,
    ...mockIdentity(8, "q-8"),
    customerName: "Aisha Khan",
    quotationDate: "2025-11-03T10:30:00.000Z",
    makkahHotel: "Swissôtel Makkah",
    madinahHotel: "InterContinental Dar Al Iman",
    status: "confirmed",
    createdBy: { id: MOCK_EMPLOYEE_USER_ID, name: "Nobin Chowdhury" },
    totalValue: 4650,
    currency: "GBP",
  },
  {
    id: "q-9",
    referenceNumber: 9,
    ...mockIdentity(9, "q-9"),
    customerName: "Omar Farooq",
    quotationDate: "2025-11-02T15:00:00.000Z",
    makkahHotel: "Fairmont Makkah",
    madinahHotel: "Pullman Zamzam Madinah",
    status: "draft",
    createdBy: { id: "user-emp-2", name: "Hasan Ali" },
    totalValue: 2100,
    currency: "GBP",
  },
  {
    id: "q-10",
    referenceNumber: 10,
    ...mockIdentity(10, "q-10"),
    customerName: "Zainab Malik",
    quotationDate: "2025-11-01T12:00:00.000Z",
    makkahHotel: "Pullman Zamzam Makkah",
    madinahHotel: "Shaza Al Madinah",
    status: "pending",
    createdBy: { id: "user-emp-3", name: "Rafi Uddin" },
    totalValue: 2780,
    currency: "GBP",
  },
  {
    id: "q-11",
    referenceNumber: 11,
    ...mockIdentity(11, "q-11"),
    customerName: "Yusuf Ahmed",
    quotationDate: "2025-10-31T09:45:00.000Z",
    makkahHotel: "Movenpick Hajar Tower Makkah",
    madinahHotel: "Hilton Madinah",
    status: "confirmed",
    createdBy: { id: MOCK_EMPLOYEE_USER_ID, name: "Nobin Chowdhury" },
    totalValue: 3920,
    currency: "GBP",
  },
  {
    id: "q-12",
    referenceNumber: 12,
    ...mockIdentity(12, "q-12"),
    customerName: "Hannah Lee",
    quotationDate: "2025-10-30T17:20:00.000Z",
    makkahHotel: "Adnan Hotel Makkah",
    madinahHotel: "Anwar Al Madinah Movenpick Hotel",
    status: "pending",
    createdBy: { id: MOCK_CURRENT_USER_ID, name: "Admin User" },
    totalValue: 3340,
    currency: "GBP",
  },
  {
    id: "q-13",
    referenceNumber: 13,
    ...mockIdentity(13, "q-13"),
    customerName: "Imran Shah",
    quotationDate: "2025-10-29T11:30:00.000Z",
    makkahHotel: "Hilton Makkah Convention Hotel",
    madinahHotel: "InterContinental Dar Al Iman",
    status: "draft",
    createdBy: { id: "user-emp-1", name: "Ahmed Chowdhury" },
    totalValue: 1560,
    currency: "GBP",
  },
  {
    id: "q-14",
    referenceNumber: 14,
    ...mockIdentity(14, "q-14"),
    customerName: "Layla Hassan",
    quotationDate: "2025-10-28T14:00:00.000Z",
    makkahHotel: "Swissôtel Makkah",
    madinahHotel: "Pullman Zamzam Madinah",
    status: "confirmed",
    createdBy: { id: "user-emp-2", name: "Hasan Ali" },
    totalValue: 4890,
    currency: "GBP",
  },
  {
    id: "q-15",
    referenceNumber: 15,
    ...mockIdentity(15, "q-15"),
    customerName: "David Chen",
    quotationDate: "2025-10-27T10:15:00.000Z",
    makkahHotel: "Fairmont Makkah",
    madinahHotel: "Shaza Al Madinah",
    status: "cancelled",
    createdBy: { id: MOCK_EMPLOYEE_USER_ID, name: "Nobin Chowdhury" },
    totalValue: 980,
    currency: "GBP",
  },
  {
    id: "q-16",
    referenceNumber: 16,
    ...mockIdentity(16, "q-16"),
    customerName: "Mariam Siddiqui",
    quotationDate: "2025-10-26T08:50:00.000Z",
    makkahHotel: "Pullman Zamzam Makkah",
    madinahHotel: "Hilton Madinah",
    status: "pending",
    createdBy: { id: MOCK_CURRENT_USER_ID, name: "Admin User" },
    totalValue: 2950,
    currency: "GBP",
  },
];

export function getMockCurrentUserIds() {
  return {
    admin: MOCK_CURRENT_USER_ID,
    employee: MOCK_EMPLOYEE_USER_ID,
  };
}

function sortQuotations(
  items: TQuotationListItem[],
  sortBy: string,
  sortOrder: "asc" | "desc",
): TQuotationListItem[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "referenceNumber":
        comparison = a.referenceNumber - b.referenceNumber;
        break;
      case "refId":
        comparison = a.refId.localeCompare(b.refId);
        break;
      case "calculatorType":
        comparison = a.calculatorType.localeCompare(b.calculatorType);
        break;
      case "customerName":
        comparison = a.customerName.localeCompare(b.customerName);
        break;
      case "quotationDate":
        comparison =
          new Date(a.quotationDate).getTime() -
          new Date(b.quotationDate).getTime();
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "createdBy":
        comparison = a.createdBy.name.localeCompare(b.createdBy.name);
        break;
      default:
        comparison =
          new Date(a.quotationDate).getTime() -
          new Date(b.quotationDate).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
}

export function queryMockQuotations(
  params: TListQuotationsParams,
  removedIds: Set<string>,
): TQuotationsListData {
  let items = BASE_QUOTATIONS.filter((item) => !removedIds.has(item.id));

  if (params.createdById) {
    items = items.filter((item) => item.createdBy.id === params.createdById);
  }

  if (params.status) {
    items = items.filter((item) => item.status === params.status);
  }

  if (params.search?.trim()) {
    const query = params.search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.customerName.toLowerCase().includes(query) ||
        item.makkahHotel.toLowerCase().includes(query) ||
        item.madinahHotel.toLowerCase().includes(query) ||
        item.createdBy.name.toLowerCase().includes(query) ||
        item.refId.toLowerCase().includes(query) ||
        item.readableId.toLowerCase().includes(query) ||
        String(item.referenceNumber).includes(query),
    );
  }

  items = sortQuotations(
    items,
    params.sortBy ?? "quotationDate",
    params.sortOrder ?? "desc",
  );

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * params.limit;

  return {
    items: items.slice(start, start + params.limit),
    pagination: {
      page,
      limit: params.limit,
      total,
      totalPages,
    },
  };
}

export function findMockQuotationById(
  id: string,
  removedIds: Set<string>,
): TQuotationListItem | undefined {
  if (removedIds.has(id)) return undefined;
  return BASE_QUOTATIONS.find((item) => item.id === id);
}
