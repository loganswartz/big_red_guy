import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { redirect } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

const AUTH_TOKEN_LOCAL_STORAGE_KEY = "auth_token";

export function isAuthenticated() {
  return window.localStorage.getItem(AUTH_TOKEN_LOCAL_STORAGE_KEY) !== null;
}

/* export function useAuthentication() { */
/*   return useLocalStorage<string | null>(AUTH_TOKEN_LOCAL_STORAGE_KEY, null); */
/* } */

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
    /* window.localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY); */
    window.location.href = "/login";
  } else if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
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
  return {};
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

export function useApiMutation<TData = unknown>(path: string) {
  const mutation = useMutation<TData, unknown, ApiOptions, unknown>({
    // @ts-expect-error
    mutationFn: (input: ApiOptions) =>
      mutateApi({ path, options: makeOptions(input) }),
  });

  return mutation;
}
