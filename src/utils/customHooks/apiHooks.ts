// Generic hook for any RTK Query endpoint
export const useApiQuery = <T>(
  queryHook: (
    path: string,
    options?: {
      refetchOnMountOrArgChange?: boolean;
      skip?: boolean;
      pollingInterval?: number;
    }
  ) => {
    data?: T;
    isError: boolean;
    isLoading: boolean;
    isFetching: boolean;
    refetch: () => void;
    error?: unknown;
  },
  path: string,
  options?: { skipQuery?: boolean; polling?: number }
) => {
  const { data, isError, isLoading, isFetching, refetch, error } = queryHook(
    path,
    {
      refetchOnMountOrArgChange: true,
      skip: options?.skipQuery || false,
      pollingInterval: options?.polling || undefined,
    }
  );

  const refetchApi = () => {
    refetch();
  };

  return {
    data,
    error,
    isLoading,
    isError,
    isFetching,
    refetchApi,
  };
};

// Generic hook for any RTK Query mutation
export const useApiMutation = <T>(
  mutationHook: () => readonly [
    (body: { path: string; reqBody: T }) => unknown,
    {
      data?: unknown;
      isLoading: boolean;
      isError: boolean;
      isSuccess: boolean;
      error?: unknown;
    }
  ],
  path: string,
  options?: {
    onSuccess?: (data: unknown) => void;
    onError?: (error: unknown) => void;
  }
) => {
  const [triggerMutation, { data, isLoading, isError, isSuccess, error }] =
    mutationHook();

  const handleTrigger = async (reqBody: T) => {
    try {
      const response = (await triggerMutation({
        path,
        reqBody,
      })) as { data?: unknown; error?: unknown };

      if (response.error) {
        options?.onError?.(response.error);
        return response;
      }

      options?.onSuccess?.(response.data);
      return response;
    } catch (err) {
      options?.onError?.(err);
      throw err;
    }
  };

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    handleTrigger,
  };
};
