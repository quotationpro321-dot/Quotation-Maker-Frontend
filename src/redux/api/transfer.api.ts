import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export type TTransferLocationDto = {
  id: string;
  slug: string;
  name: string;
};

export const transferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTransferLocations: builder.query<IResponse<TTransferLocationDto[]>, void>({
      query: () => ({ url: "/transfer-locations", method: "GET" }),
      providesTags: [{ type: "TransferCatalog", id: "LOCATIONS" }],
    }),
  }),
});

export const { useListTransferLocationsQuery } = transferApi;
