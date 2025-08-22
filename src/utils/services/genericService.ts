import { baseApi } from "../api/baseApi";

const genericService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGenericRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
    }),
    postGenericRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: "POST",
        body: body?.reqBody,
      }),
    }),
  }),
});

export const { useGetGenericRequestQuery, usePostGenericRequestMutation } =
  genericService;
