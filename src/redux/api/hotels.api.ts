import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export type THotelAreaDto = {
  id: string;
  slug: string;
  name: string;
};

export type THotelDto = {
  id: string;
  name: string;
  city: string;
  country: string;
  distance: string;
  areaId: string;
  areaSlug: string;
  areaName: string;
};

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHotelAreas: builder.query<IResponse<THotelAreaDto[]>, void>({
      query: () => ({ url: "/hotel-areas", method: "GET" }),
      providesTags: [{ type: "HotelCatalog", id: "AREAS" }],
    }),
    listHotelsByArea: builder.query<IResponse<THotelDto[]>, { area: string }>({
      query: ({ area }) => ({
        url: "/hotels",
        method: "GET",
        params: { area },
      }),
      providesTags: (_result, _error, { area }) => [
        { type: "HotelCatalog", id: area },
      ],
    }),
  }),
});

export const { useListHotelAreasQuery, useListHotelsByAreaQuery } = hotelsApi;
