import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type {
  TListQuotationsParams,
  TQuotationDetail,
  TQuotationDraft,
  TQuotationListItem,
  TQuotationsListData,
  TUpdateQuotationStatusPayload,
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
    listDeletedQuotations: builder.query<
      IResponse<TQuotationsListData>,
      TListQuotationsParams
    >({
      query: (params) => ({
        url: `${QUOTATIONS_URL}/bin`,
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
    getQuotationDetail: builder.query<IResponse<TQuotationDetail>, string>({
      query: (id) => ({
        url: `${QUOTATIONS_URL}/${id}/full`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Quotations", id }],
    }),
    createQuotation: builder.mutation<IResponse<TQuotationDetail>, TQuotationDraft>(
      {
        query: (body) => ({
          url: QUOTATIONS_URL,
          method: "POST",
          data: body,
        }),
        invalidatesTags: ["Quotations", "Dashboard"],
      },
    ),
    updateQuotation: builder.mutation<
      IResponse<TQuotationDetail>,
      { id: string; body: TQuotationDraft }
    >({
      query: ({ id, body }) => ({
        url: `${QUOTATIONS_URL}/${id}`,
        method: "PUT",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Quotations",
        { type: "Quotations", id },
        "Dashboard",
      ],
    }),
    updateQuotationStatus: builder.mutation<
      IResponse<TQuotationDetail>,
      { id: string; body: TUpdateQuotationStatusPayload }
    >({
      query: ({ id, body }) => ({
        url: `${QUOTATIONS_URL}/${id}/status`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Quotations",
        { type: "Quotations", id },
        "Dashboard",
      ],
    }),
    deleteQuotation: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `${QUOTATIONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quotations", "Dashboard"],
    }),
    restoreQuotation: builder.mutation<IResponse<TQuotationListItem>, string>({
      query: (id) => ({
        url: `${QUOTATIONS_URL}/${id}/restore`,
        method: "POST",
      }),
      invalidatesTags: ["Quotations", "Dashboard"],
    }),
  }),
});

export const {
  useListQuotationsQuery,
  useListMyQuotationsQuery,
  useListDeletedQuotationsQuery,
  useGetQuotationQuery,
  useGetQuotationDetailQuery,
  useLazyGetQuotationDetailQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useUpdateQuotationStatusMutation,
  useDeleteQuotationMutation,
  useRestoreQuotationMutation,
} = quotationsApi;
