import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";

function formatURL(path: string) {
  // collapse any duplicate slashes
  const namespaced = `/api/${path}`.replace(/\/{2,}/, "/");

  if (process.env.REACT_APP_HOST) {
    return new URL(namespaced, process.env.REACT_APP_HOST).href;
  } else {
    return namespaced;
  }
}

async function apiFetch(path: string, options: RequestInit) {
  const response = await fetch(formatURL(path), options);

  if (response.status === 401) {
    window.location.href = "/login";
  } else if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  try {
    return await response.json();
  } catch (e: any) {
    return null;
  }
}

type FetchKey = readonly [string, RequestInit];

const queryApi: QueryFunction<unknown, FetchKey> = async (args) => {
  const {
    queryKey: [path, options],
  } = args;
  return apiFetch(path, options);
};

interface MutationVariables {
  path: string;
  options: RequestInit;
}

const mutateApi: MutationFunction<unknown, MutationVariables> = async (
  args
) => {
  const { path, options } = args;
  return apiFetch(path, { method: "POST", ...options });
};

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      // @ts-expect-error
      queryFn: queryApi,
    },
    mutations: {
      // @ts-expect-error
      mutationFn: mutateApi,
    },
  },
});

interface BaseApiOptions {
  fetchOptions?: RequestInit;
}

interface JsonApiOptions extends BaseApiOptions {
  json?: any;
}

interface FormApiOptions extends BaseApiOptions {
  data?: any;
}

type ApiOptions = JsonApiOptions | FormApiOptions;

function usingForm(obj: any): obj is FormApiOptions {
  return (obj as FormApiOptions).data !== undefined;
}

function usingJson(obj: any): obj is JsonApiOptions {
  return (obj as JsonApiOptions).json !== undefined;
}

function makeOptions<T extends ApiOptions>(options: T): RequestInit {
  if (usingForm(options)) {
    const { data, fetchOptions } = options;
    return { body: new URLSearchParams(data), ...fetchOptions };
  } else if (usingJson(options)) {
    const { json, fetchOptions } = options;
    const { headers, ...other } = fetchOptions ?? {};

    return {
      body: json,
      headers: { "Content-Type": "application/json", ...headers },
      ...other,
    };
  }

  // if no special case found, return the unchanged fetchOptions
  const { fetchOptions } = options;
  return fetchOptions;
}

export function useApiQuery<TData = unknown>(
  path: string,
  options?: ApiOptions
) {
  const fetchOptions = options ? makeOptions(options) : {};

  const query = useQuery<ApiOptions, unknown, TData>({
    queryKey: [path, fetchOptions],
  });

  return query;
}

export function useApiMutation<TData = unknown>(
  path: string,
  defaultFetchOptions?: ApiOptions["fetchOptions"],
  useMutationOptions?: Omit<UseMutationOptions<TData>, "mutationFn">
) {
  const mutation = useMutation<TData, unknown, ApiOptions, unknown>({
    // @ts-ignore
    mutationFn: (input?: ApiOptions) => {
      const combined = {
        ...input,
        fetchOptions: { ...defaultFetchOptions, ...input?.fetchOptions },
      };
      const options = makeOptions(combined);

      return mutateApi({
        path,
        options,
      });
    },
    ...useMutationOptions,
  });

  return mutation;
}
