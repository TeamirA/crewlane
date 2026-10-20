import type { NextResponse } from "next/server";

import type { AuthSession } from "@/core/application/dtos/authDtos";

import { ACCESS_TOKEN_TTL_SECONDS } from "./tokenLifetimes";

export const ACCESS_TOKEN_COOKIE = "crewlane_access";
export const REFRESH_TOKEN_COOKIE = "crewlane_refresh";

// The refresh token is only ever sent to auth endpoints.
const REFRESH_TOKEN_PATH = "/api/auth";

const baseCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function setAuthCookies(response: NextResponse, session: AuthSession): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, session.accessToken, {
    ...baseCookieOptions,
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, session.refreshToken, {
    ...baseCookieOptions,
    path: REFRESH_TOKEN_PATH,
    expires: session.refreshTokenExpiresAt,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", { ...baseCookieOptions, path: "/", maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    ...baseCookieOptions,
    path: REFRESH_TOKEN_PATH,
    maxAge: 0,
  });
}
