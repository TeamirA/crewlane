import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE } from "@/infrastructure/auth/authCookies";
import { JoseTokenService } from "@/infrastructure/auth/joseTokenService";
import { getServerEnv } from "@/infrastructure/config/serverEnv";
import { ROUTES } from "@/lib/constants";

const AUTH_PAGES: string[] = [ROUTES.login, ROUTES.register];

async function hasValidAccessToken(request: NextRequest): Promise<boolean> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) {
    return false;
  }
  const env = getServerEnv();
  const tokenService = new JoseTokenService(env.JWT_ACCESS_SECRET, env.JWT_REFRESH_SECRET);
  return (await tokenService.verifyAccessToken(accessToken)) !== null;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = await hasValidAccessToken(request);
  if (AUTH_PAGES.includes(pathname)) {
    return isAuthenticated
      ? NextResponse.redirect(new URL(ROUTES.projects, request.url))
      : NextResponse.next();
  }
  if (isAuthenticated) {
    return NextResponse.next();
  }
  // The refresh endpoint rotates the session (if any) and redirects back or to login.
  const refreshUrl = new URL("/api/auth/refresh", request.url);
  refreshUrl.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(refreshUrl);
}

export const config = {
  matcher: ["/projects/:path*", "/login", "/register"],
};
