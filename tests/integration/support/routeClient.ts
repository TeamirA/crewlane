import { NextRequest } from "next/server";

type RouteHandler<TParams> = (
  request: NextRequest,
  context: { params: Promise<TParams> },
) => Promise<Response>;

interface RouteCall<TParams> {
  method?: string;
  body?: unknown;
  cookie?: string;
  params?: TParams;
  ip?: string;
}

export async function callRoute<TParams = Record<string, never>>(
  handler: RouteHandler<TParams>,
  { method = "GET", body, cookie, params, ip = "203.0.113.10" }: RouteCall<TParams> = {},
) {
  const headers = new Headers({ "x-real-ip": ip });
  if (cookie) headers.set("cookie", cookie);
  if (body !== undefined) headers.set("content-type", "application/json");
  const request = new NextRequest("http://localhost/api/test", {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const response = await handler(request, { params: Promise.resolve(params ?? ({} as TParams)) });
  const json = (await response.json()) as { data?: Record<string, unknown>; error?: unknown };
  return { status: response.status, json, setCookie: response.headers.getSetCookie() };
}

export function toCookieHeader(setCookieHeaders: string[]): string {
  return setCookieHeaders.map((header) => header.split(";")[0]).join("; ");
}
