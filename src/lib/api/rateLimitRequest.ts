import type { NextRequest } from "next/server";

import {
  enforceRateLimit,
  type RateLimitPolicy,
} from "@/core/application/services/enforceRateLimit";
import { getDependencies } from "@/infrastructure/container";

// Vercel sets x-real-ip to the connecting client, so it is preferred over x-forwarded-for.
function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return realIp || forwardedFor || "unknown";
}

export function rateLimitRequest(request: NextRequest, policy: RateLimitPolicy): Promise<void> {
  return enforceRateLimit(getDependencies().rateLimiter, policy, getClientIp(request));
}
