import type { NextRequest } from "next/server";

import { AuthenticationError } from "@/core/domain/errors/domainErrors";
import { ACCESS_TOKEN_COOKIE } from "@/infrastructure/auth/authCookies";
import { getDependencies } from "@/infrastructure/container";

export async function requireUserId(request: NextRequest): Promise<string> {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = accessToken
    ? await getDependencies().tokens.verifyAccessToken(accessToken)
    : null;
  if (!payload) {
    throw new AuthenticationError("Authentication required");
  }
  return payload.userId;
}
