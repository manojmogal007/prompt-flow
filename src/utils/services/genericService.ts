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
      providesTags: [{ type: 'workflow' } as any, { type: 'create-workflow' } as any],
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
      invalidatesTags: [{ type: 'create-workflow' } as any],
    }),
    postWorkflowDeleteRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
    }),
    updateWorkflowRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'PUT',
        body: body?.reqBody,
      }),
      // invalidatesTags: [{ type: 'workflow' } as any],
    }),

    // Workflow Execution endpoints
    postExecutionRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'execution' } as any],
    }),
    getExecutionRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'execution' } as any],
    }),

    // Admin Settings endpoints
    getAllUsersSettingsRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'settings' } as any],
    }),
    getLoggedInUserSettingsRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'fetch-settings' } as any],
    }),
    getUserSettingsRequest: builder.query({
      query: (getQuery) => ({
        url: getQuery,
      }),
      providesTags: [{ type: 'settings' } as any],
    }),
    updateSettingsRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'PUT',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'settings' } as any],
    }),
    blockUserRequest: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
      invalidatesTags: [{ type: 'settings' } as any],
    }),
    postLiveRoomsUsage: builder.mutation({
      query: (body) => ({
        url: body.path,
        method: 'POST',
        body: body?.reqBody,
      }),
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
  usePostExecutionRequestMutation,
  useGetExecutionRequestQuery,
  useGetLoggedInUserSettingsRequestQuery,
  useGetAllUsersSettingsRequestQuery,
  useGetUserSettingsRequestQuery,
  useUpdateSettingsRequestMutation,
  useBlockUserRequestMutation,
  usePostLiveRoomsUsageMutation,
} = genericService;
