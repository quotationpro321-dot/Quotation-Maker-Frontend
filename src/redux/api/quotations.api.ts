import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type {
  TListQuotationsParams,
  TQuotationListItem,
  TQuotationsListData,
} from "@/types/quotation.type";

const QUOTATIONS_URL = "/quotations";

export const quotationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listQuotations: builder.query<
      IResponse<TQuotationsListData>,
      TListQuotationsParams
    >({
      query: (params) => ({
        url: QUOTATIONS_URL,
        method: "GET",
        params,
      }),
      providesTags: ["Quotations"],
    }),
    listMyQuotations: builder.query<
      IResponse<TQuotationsListData>,
      Omit<TListQuotationsParams, "createdById">
    >({
      query: (params) => ({
        url: `${QUOTATIONS_URL}/mine`,
        method: "GET",
        params,
      }),
      providesTags: ["Quotations"],
    }),
    getQuotation: builder.query<IResponse<TQuotationListItem>, string>({
      query: (id) => ({
        url: `${QUOTATIONS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Quotations", id }],
    }),
    deleteQuotation: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `${QUOTATIONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quotations"],
    }),
  }),
});

export const {
  useListQuotationsQuery,
  useListMyQuotationsQuery,
  useGetQuotationQuery,
  useDeleteQuotationMutation,
} = quotationsApi;
