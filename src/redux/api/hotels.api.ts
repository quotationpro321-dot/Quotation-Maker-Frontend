import { baseApi } from "@/redux/baseApi";
import type { IResponse } from "@/types";

export type TCalculatorCatalogType = "umrah" | "holiday";

export type THotelAreaDto = {
  id: string;
  slug: string;
  name: string;
  calculatorType: TCalculatorCatalogType;
  sortOrder: number;
  isActive: boolean;
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
  sortOrder: number;
  isActive: boolean;
};

type TListHotelAreasArgs = {
  calculatorType?: TCalculatorCatalogType;
  includeInactive?: boolean;
};

type TListHotelsByAreaArgs = {
  area?: string;
  areaId?: string;
  calculatorType?: TCalculatorCatalogType;
  includeInactive?: boolean;
};

type TCreateHotelAreaBody = {
  name: string;
  slug?: string;
  calculatorType: TCalculatorCatalogType;
  sortOrder?: number;
};

type TUpdateHotelAreaBody = {
  id: string;
  name?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
};

type TCreateHotelBody = {
  areaId: string;
  name: string;
  city?: string;
  country?: string;
  distance?: string;
  sortOrder?: number;
};

type TUpdateHotelBody = {
  id: string;
  name?: string;
  city?: string;
  country?: string;
  distance?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export const hotelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listHotelAreas: builder.query<
      IResponse<THotelAreaDto[]>,
      TListHotelAreasArgs | void
    >({
      query: (args) => ({
        url: "/hotel-areas",
        method: "GET",
        params: {
          calculatorType: args?.calculatorType,
          includeInactive: args?.includeInactive ? "true" : undefined,
        },
      }),
      providesTags: (result, _error, args) => [
        { type: "HotelCatalog", id: "AREAS" },
        {
          type: "HotelCatalog",
          id: `AREAS-${args?.calculatorType ?? "all"}`,
        },
      ],
    }),
    listHotelsByArea: builder.query<
      IResponse<THotelDto[]>,
      TListHotelsByAreaArgs
    >({
      query: ({ area, areaId, calculatorType, includeInactive }) => ({
        url: "/hotels",
        method: "GET",
        params: {
          area,
          areaId,
          calculatorType,
          includeInactive: includeInactive ? "true" : undefined,
        },
      }),
      providesTags: (_result, _error, { area, areaId }) => [
        { type: "HotelCatalog", id: areaId ?? area ?? "unknown" },
      ],
    }),
    createHotelArea: builder.mutation<
      IResponse<THotelAreaDto>,
      TCreateHotelAreaBody
    >({
      query: (body) => ({
        url: "/hotel-areas",
        method: "POST",
        data: body,
      }),
      invalidatesTags: [{ type: "HotelCatalog" }],
    }),
    updateHotelArea: builder.mutation<
      IResponse<THotelAreaDto>,
      TUpdateHotelAreaBody
    >({
      query: ({ id, ...body }) => ({
        url: `/hotel-areas/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: [{ type: "HotelCatalog" }],
    }),
    deleteHotelArea: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/hotel-areas/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "HotelCatalog" }],
    }),
    createHotel: builder.mutation<IResponse<THotelDto>, TCreateHotelBody>({
      query: (body) => ({
        url: "/hotels",
        method: "POST",
        data: body,
      }),
      invalidatesTags: (result) => [
        { type: "HotelCatalog" },
        ...(result?.data?.areaSlug
          ? [{ type: "HotelCatalog" as const, id: result.data.areaSlug }]
          : []),
      ],
    }),
    updateHotel: builder.mutation<IResponse<THotelDto>, TUpdateHotelBody>({
      query: ({ id, ...body }) => ({
        url: `/hotels/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (result) => [
        { type: "HotelCatalog" },
        ...(result?.data?.areaSlug
          ? [{ type: "HotelCatalog" as const, id: result.data.areaSlug }]
          : []),
      ],
    }),
    deleteHotel: builder.mutation<IResponse<null>, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "HotelCatalog" }],
    }),
  }),
});

export const {
  useListHotelAreasQuery,
  useListHotelsByAreaQuery,
  useCreateHotelAreaMutation,
  useUpdateHotelAreaMutation,
  useDeleteHotelAreaMutation,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelsApi;
