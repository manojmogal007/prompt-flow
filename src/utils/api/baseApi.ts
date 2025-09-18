import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BACKEND_BASE_URL } from '../../config';
import type { RootState } from '../../store/types';
import { handleAccessToken } from '../../auth/authSlice';

// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: BACKEND_BASE_URL,
//     credentials: "include",
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.accessToken;
//       if (token) headers.set("authorization", `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
// });

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh
    const refreshResult = await baseQuery({ url: '/users/refreshToken', method: 'POST' }, api, extraOptions);
    if (refreshResult.data) {
      // Store new accessToken in Redux
      const { accessToken } = refreshResult.data as { accessToken: string };
      api.dispatch(handleAccessToken(accessToken));

      // Retry original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → log user out
      api.dispatch({ type: 'auth/logout' });
      const toLogin = `${window.location.origin}/prompt-flow/auth/signin`;
      window.location.href = toLogin;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['steps'],
  endpoints: () => ({}),
});
