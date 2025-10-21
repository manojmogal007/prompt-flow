import { baseApi } from '../api/baseApi';

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
        method: 'POST',
        body: body?.reqBody,
      }),
    }),
    getStepsRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'steps' } as any],
    }),
    postStepsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'steps' } as any],
    }),
    putStepsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'PUT',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'steps' } as any],
    }),
    getWorkflowsRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'workflow' } as any],
    }),
    postWorkflowsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'workflow' } as any],
    }),
    postWorkflowsDeleteRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'workflow' } as any],
    }),
    updateWorkflowsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'PUT',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'workflow' } as any],
    }),
    getContributorsRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'contributors' } as any],
    }),
    postContributorsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'contributors' } as any],
    }),
    updateContributorsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'PUT',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'contributors' } as any],
    }),
    getWorkflowRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      // providesTags: [{ type: 'workflow' } as any],
    }),
    postWorkflowRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      // invalidatesTags: [{ type: 'workflow' } as any],
    }),
    postWorkflowDeleteRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      // invalidatesTags: [{ type: 'workflow' } as any],
    }),
    updateWorkflowRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'PUT',
        body: body?.reqBody,
      }),
      // invalidatesTags: [{ type: 'workflow' } as any],
    }),
  }),
});

export const {
  useGetGenericRequestQuery,
  usePostGenericRequestMutation,
  useGetStepsRequestQuery,
  usePostStepsRequestMutation,
  usePutStepsRequestMutation,
  useGetWorkflowsRequestQuery,
  usePostWorkflowsRequestMutation,
  usePostWorkflowsDeleteRequestMutation,
  useUpdateWorkflowsRequestMutation,
  useGetContributorsRequestQuery,
  usePostContributorsRequestMutation,
  useUpdateContributorsRequestMutation,
  useGetWorkflowRequestQuery,
  usePostWorkflowRequestMutation,
  usePostWorkflowDeleteRequestMutation,
  useUpdateWorkflowRequestMutation,
} = genericService;
