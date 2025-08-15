import { baseApi } from "../api/baseApi";

const authService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
    }),
    postAuthRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: "POST",
        body: body?.reqBody,
      }),
    }),
  }),
});

export const { useGetAuthRequestQuery, usePostAuthRequestMutation } =
  authService;
