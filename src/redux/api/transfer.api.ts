import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";
import type { TCalculatorCatalogType } from "@/redux/api/hotels.api";

export type TTransferLocationDto = {
  id: string;
  slug: string;
  name: string;
  calculatorType: TCalculatorCatalogType;
  sortOrder: number;
  isActive: boolean;
};

type TListTransferLocationsArgs = {
  calculatorType?: TCalculatorCatalogType;
  includeInactive?: boolean;
};

type TCreateTransferLocationBody = {
  name: string;
  slug?: string;
  calculatorType: TCalculatorCatalogType;
  sortOrder?: number;
};

type TUpdateTransferLocationBody = {
  id: string;
  name?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export const transferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTransferLocations: builder.query<
      IResponse<TTransferLocationDto[]>,
      TListTransferLocationsArgs | void
    >({
      query: (args) => ({
        url: "/transfer-locations",
        method: "GET",
        params: {
          calculatorType: args?.calculatorType,
          includeInactive: args?.includeInactive ? "true" : undefined,
        },
      }),
      providesTags: (result, _error, args) => [
        { type: "TransferCatalog", id: "LOCATIONS" },
        {
          type: "TransferCatalog",
          id: `LOCATIONS-${args?.calculatorType ?? "all"}`,
        },
      ],
    }),
    createTransferLocation: builder.mutation<
      IResponse<TTransferLocationDto>,
      TCreateTransferLocationBody
    >({
      query: (body) => ({
        url: "/transfer-locations",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "TransferCatalog" }],
    }),
    updateTransferLocation: builder.mutation<
      IResponse<TTransferLocationDto>,
      TUpdateTransferLocationBody
    >({
      query: ({ id, ...body }) => ({
        url: `/transfer-locations/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [{ type: "TransferCatalog" }],
    }),
    deleteTransferLocation: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/transfer-locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "TransferCatalog" }],
    }),
  }),
});

export const {
  useListTransferLocationsQuery,
  useCreateTransferLocationMutation,
  useUpdateTransferLocationMutation,
  useDeleteTransferLocationMutation,
} = transferApi;
