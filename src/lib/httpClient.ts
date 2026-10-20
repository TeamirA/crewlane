import type { ApiErrorBody } from "@/types/api";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

let pendingRefresh: Promise<boolean> | null = null;

// Concurrent 401s share a single refresh call so the rotated token is not reused.
function refreshSessionOnce(): Promise<boolean> {
  pendingRefresh ??= fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" })
    .then((response) => response.ok)
    .finally(() => {
      pendingRefresh = null;
    });
  return pendingRefresh;
}

function sendRequest(path: string, { method = "GET", body }: RequestOptions) {
  return fetch(path, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function toApiRequestError(response: Response): Promise<ApiRequestError> {
  const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null;
  return new ApiRequestError(
    errorBody?.error.message ?? "Request failed",
    response.status,
    errorBody?.error.code ?? "UNKNOWN_ERROR",
    errorBody?.error.details,
  );
}

export async function apiRequest<TData>(path: string, options: RequestOptions = {}) {
  let response = await sendRequest(path, options);
  const canRefresh = response.status === 401 && !path.startsWith("/api/auth/");
  if (canRefresh && (await refreshSessionOnce())) {
    response = await sendRequest(path, options);
  }
  if (!response.ok) {
    throw await toApiRequestError(response);
  }
  const { data } = (await response.json()) as { data: TData };
  return data;
}
