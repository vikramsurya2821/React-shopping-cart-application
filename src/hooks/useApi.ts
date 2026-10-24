import { useCallback, useState } from "react";

interface UseApiState<TResult> {
  data: TResult | null;
  loading: boolean;
  error: string | null;
}

type ApiService<TArgs extends unknown[], TResult> =
  (...args: TArgs) => Promise<TResult>;

function useApi<TArgs extends unknown[], TResult>(
  service: ApiService<TArgs, TResult>
) {
  const [state, setState] = useState<UseApiState<TResult>>({
    data: null,
    loading: false,
    error: null,
  });

  const callAPI = useCallback(
    async (...args: TArgs) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const data = await service(...args);

        setState({
          data,
          loading: false,
          error: null,
        });

        return data;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong";

        setState({
          data: null,
          loading: false,
          error: message,
        });

        throw err;
      }
    },
    [service]
  );

  return {
    ...state,
    callAPI,
  };
}

export default useApi;