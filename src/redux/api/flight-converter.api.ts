import { baseApi } from "@/redux/baseApi";
import type {
  ParseItineraryRequest,
  ParseItineraryResponse,
} from "@/features/flight-converter/types/flight-converter.types";
import type { IResponse } from "@/types";

const FLIGHT_CONVERTER_URL = "/flight-converter";

export const flightConverterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    parseItinerary: builder.mutation<
      IResponse<ParseItineraryResponse>,
      ParseItineraryRequest
    >({
      query: (body) => ({
        url: `${FLIGHT_CONVERTER_URL}/parse`,
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const { useParseItineraryMutation } = flightConverterApi;
