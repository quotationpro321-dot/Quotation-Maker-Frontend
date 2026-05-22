export type TQuotationStatus = "draft" | "pending" | "confirmed" | "cancelled";

export type TQuotationCreator = {
  id: string;
  name: string;
};

export type TQuotationListItem = {
  id: string;
  referenceNumber: number;
  customerName: string;
  customerPhone?: string;
  quotationDate: string;
  makkahHotel: string;
  madinahHotel: string;
  status: TQuotationStatus;
  createdBy: TQuotationCreator;
  totalValue?: number;
  currency: string;
};

export type TListQuotationsParams = {
  page: number;
  limit: number;
  search?: string;
  status?: TQuotationStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  createdById?: string;
};

export type TQuotationsListData = {
  items: TQuotationListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
