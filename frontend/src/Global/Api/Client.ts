import {
  MutationFunction,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CustomError } from "ts-custom-error";

/**
 * A custom error class specifically for the API.
 *
 * Makes it a bit easier to pass through error messages from the API.
 */
export class ApiError extends CustomError {
  public data: Record<string, any>;

  public constructor(public code: number, data: Record<string, any>) {
    super(data?.message ?? ApiError.FallbackMsg);
    this.data = data;
  }
  static get FallbackMsg() {
    return "Network response was not OK.";
  }

  public toString() {
    return this.data?.message ?? ApiError.FallbackMsg;
  }
}

/**
 * Automatically prefixes any API routes with `/api`, so we don't need to
 * manually add that boilerplate everywhere. Also prepends the ENV host if
 * present, and strips any doubled-up slashes from the resulting path.
 */
function formatURL(path: string) {
  // collapse any duplicate slashes
  const namespaced = `/api/${path}`.replace(/\/{2,}/, "/");

  if (process.env.REACT_APP_HOST) {
    return new URL(namespaced, process.env.REACT_APP_HOST).href;
  } else {
    return namespaced;
  }
}

/**
 * The actual workhorse function behind our React Query implementation.
 *
 * Automatically redirects us to the login page if we receive a 401 return code
 * (which the API automatically returns if a user is not authenticated), as well
 * as automatically parsing the response to JSON and raising an error if the
 * response didn't finish with a 2xx level return code.
 */
async function apiFetch<R>(
  path: string,
  options: RequestInit
): Promise<R | null> {
  const response = await fetch(formatURL(path), options);

  if (response.status === 401) {
    window.location.href = "/login";
  }

  let data = null;
  try {
    data = (await response.json()) as R;
  } catch (e: any) {
    const length = response.headers.get("Content-Length");
    const hasContent = length !== null && parseInt(length) > 0;

    if (hasContent) {
      throw new ApiError(response.status, {
        message: "Response did not contain valid JSON.",
      });
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data ?? { message: "(No data returned)" }
    );
  }

  return data;
}

/**
 * Apply some automatic transforms to our BaseApiOptions object.
 *
 * Mainly used to automatically set the proper headers and jsonify our data
 * input, so we don't have to deal with that manually.
 */
function makeOptions<T extends SimpleApiOptions>(
  options?: T
): { path: T["path"]; options: RequestInit } {
  const { path, data, headers, params, method } = options ?? {};

  let newPath: string | undefined = path;
  let newOptions: RequestInit = { headers, method };
  if (data) {
    newOptions = {
      ...newOptions,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", ...headers },
    };
  }

  if (params) {
    newPath = `${path}?${params}`;
  }

  // if no special case found, return the unchanged headers
  return { path: newPath, options: newOptions };
}

type TemplateFunction = (...args: any) => string;

interface SimpleApiOptions {
  path?: string;
  data?: any;
  params?: URLSearchParams;
  headers?: RequestInit["headers"];
  method?: RequestInit["method"];
}

interface ApiOptions<T> extends Omit<SimpleApiOptions, "path"> {
  path?: ApiPathParameters<T>;
}

interface DefaultApiOptions<T> extends Omit<SimpleApiOptions, "path"> {
  path: ApiPath<T>;
}

type ApiPath<T> = T extends TemplateFunction ? T : string;
type ApiPathParameters<T> = T extends TemplateFunction ? Parameters<T> : string;

/**
 * Custom query wrapper for easily creating standardized query hooks.
 *
 * Takes a generic type parameter: `TData`, which is the datatype that the
 * endpoint will return.
 */
export function useApiQuery<TData = unknown>(
  path: SimpleApiOptions["path"],
  defaultOptions?: Omit<SimpleApiOptions, "path">
) {
  const { path: newPath, options } = makeOptions({ path, ...defaultOptions });

  if (!newPath) {
    throw new Error("No path specified to query hook.");
  }

  const query = useQuery({
    queryKey: [newPath],
    queryFn: async (_) => {
      return apiFetch<TData>(newPath, options);
    },
  });

  return query;
}

/**
 * Custom mutation wrapper for easily creating standardized mutation hooks.
 *
 * Has 2 generic type parameters: `TData`, which is the datatype that the
 * endpoint will return, and `TPath`, which is the type of the `path` key in the
 * default API options passed to the hook.
 *
 * Using this hook allows passing either a path string (ex. `/me/wishlists`), or
 * a template function to defer generation of the path string until we are using
 * `mutate`. Then, when calling `mutate`, you just have to pass the required
 * variables in as the `path` argument. For example:
 *
 * ```typescript
 * const template = (id: string) => `/me/wishlists/${id}`;
 * const { mutate } = useApiMutation<Wishlist, typeof template>({ path: template });
 *
 * mutate({ path: [6] });
 * ```
 *
 * When using a template function for the path, it's currently required that you
 * pass `typeof <your template function>` into the hook as `TPath`. `TPath =
 * string` can eventually be updated to something like `TPath = *` to enable
 * automatic inference once this is merged:
 * https://github.com/microsoft/TypeScript/issues/10571
 */
export function useApiMutation<TData = unknown, TPath = string>(
  defaultApiOptions?: DefaultApiOptions<TPath>,
  defaultMutationOptions?: Omit<
    UseMutationOptions<TData | null, ApiError, ApiOptions<TPath>, unknown>,
    "mutationFn"
  >
) {
  const client = useQueryClient();
  let { path: defaultPath, ...other } = defaultApiOptions ?? {};

  const mutationFn: MutationFunction<TData | null, ApiOptions<TPath>> = async (
    variables: ApiOptions<TPath>
  ) => {
    const path = determinePath(defaultPath, variables.path);

    const { path: uri, options } = makeOptions({
      method: "POST",
      ...other,
      ...variables,
      path,
    });

    if (!uri) {
      throw new Error("No path supplied to mutation hook");
    }

    const result = await apiFetch<TData>(uri, options);

    // autoinvalidate queries with the same path
    client.invalidateQueries({ queryKey: [uri] });

    return result;
  };

  const mutation = useMutation({
    mutationFn,
    ...defaultMutationOptions,
  });

  return mutation;
}

/**
 * Calculate a real path base on the default path and override path.
 *
 * The default path is passed as an argument to the hook (`useApiMutation`),
 * and the override is passed as an argument to the functions produced by the
 * hook (`mutate` or `mutateAsync`).
 *
 * `useApiMutation` can determine a path in one of 3 ways:
 *
 *   1. Passing a default path (string), without an override
 *   2. Passing an override (string)
 *   3. Passing a template function as the default path, and a set of arguments
 *      for that function as the override.
 *
 * This function handles resolving those 3 scenarios down to a single concrete
 * path to be passed to `fetch`.
 */
function determinePath<T>(
  defaultPath: ApiPath<T> | undefined,
  overridePath: ApiPathParameters<T> | undefined
) {
  let path: string | undefined;

  if (typeof defaultPath === "function") {
    path = defaultPath(...(overridePath as any));
  } else if (typeof defaultPath === "string") {
    path = overridePath || defaultPath;
  }

  return path?.toString();
}
