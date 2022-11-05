import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

function formatURL(path: string) {
  const url = new URL(path, process.env.REACT_APP_HOST);
  return url.href;
}

async function apiFetch(path: string, options: RequestInit) {
  const response = await fetch(formatURL(path), options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response;
}

type FetchKey = readonly [string, RequestInit];

const queryApi: QueryFunction<unknown, FetchKey> = async (args) => {
  const {
    queryKey: [path, options],
  } = args;
  return apiFetch(formatURL(path), options);
};

interface MutationVariables {
  path: string;
  options: RequestInit;
}

const mutateApi: MutationFunction<unknown, MutationVariables> = async (
  args
) => {
  const { path, options } = args;
  return apiFetch(formatURL(path), { method: "POST", ...options });
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

export function useApiQuery(path: string, options: ApiOptions) {
  const fetchOptions = makeOptions(options);

  const query = useQuery({ queryKey: [path, fetchOptions] });

  return query;
}

export function useApiMutation(path: string) {
  const mutation = useMutation({
    mutationFn: (input: ApiOptions) =>
      mutateApi({ path, options: makeOptions(input) }),
  });

  return mutation;
}
