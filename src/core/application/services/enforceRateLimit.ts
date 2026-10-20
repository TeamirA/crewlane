import { RateLimitError } from "../../domain/errors/domainErrors";
import type { RateLimiter } from "../../domain/services/rateLimiter";

export interface RateLimitPolicy {
  name: string;
  limit: number;
  windowSeconds: number;
}

export const AUTH_RATE_LIMITS = {
  login: { name: "login", limit: 10, windowSeconds: 60 },
  register: { name: "register", limit: 5, windowSeconds: 600 },
  refresh: { name: "refresh", limit: 30, windowSeconds: 60 },
} satisfies Record<string, RateLimitPolicy>;

export async function enforceRateLimit(
  rateLimiter: RateLimiter,
  policy: RateLimitPolicy,
  clientKey: string,
): Promise<void> {
  const result = await rateLimiter.consume(
    `${policy.name}:${clientKey}`,
    policy.limit,
    policy.windowSeconds,
  );
  if (!result.isAllowed) {
    throw new RateLimitError("Too many attempts, please try again later", result.retryAfterSeconds);
  }
}
