import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { refreshSession } from "@/core/application/use-cases/auth/refreshSession";
import { AuthenticationError } from "@/core/domain/errors/domainErrors";
import {
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} from "@/infrastructure/auth/authCookies";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { ROUTES } from "@/lib/constants";
import { getSafeRedirectPath } from "@/lib/getSafeRedirectPath";

async function rotateSessionFromCookie(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    throw new AuthenticationError("Session expired, please sign in again");
  }
  return refreshSession(getDependencies(), refreshToken);
}

export const POST = createApiHandler(async (request) => {
  const session = await rotateSessionFromCookie(request);
  const response = respondWithData({ user: session.user });
  setAuthCookies(response, session);
  return response;
});

// Page navigations with an expired access token are redirected here by the proxy.
export async function GET(request: NextRequest) {
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));
  try {
    const session = await rotateSessionFromCookie(request);
    const response = NextResponse.redirect(new URL(nextPath, request.url));
    setAuthCookies(response, session);
    return response;
  } catch {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set("next", nextPath);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }
}
