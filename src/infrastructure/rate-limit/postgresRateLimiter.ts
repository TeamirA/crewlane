import type { PrismaClient } from "@prisma/client";

import type { RateLimiter, RateLimitResult } from "@/core/domain/services/rateLimiter";

interface BucketRow {
  count: number;
  windowStartsAt: Date;
}

// Fixed-window counter stored in Postgres so limits hold across serverless instances.
export class PostgresRateLimiter implements RateLimiter {
  constructor(private readonly prisma: PrismaClient) {}

  async consume(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
    const [bucket] = await this.prisma.$queryRaw<BucketRow[]>`
      INSERT INTO "RateLimitBucket" ("key", "count", "windowStartsAt")
      VALUES (${key}, 1, now())
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE
          WHEN "RateLimitBucket"."windowStartsAt" < now() - make_interval(secs => ${windowSeconds})
          THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
        "windowStartsAt" = CASE
          WHEN "RateLimitBucket"."windowStartsAt" < now() - make_interval(secs => ${windowSeconds})
          THEN now() ELSE "RateLimitBucket"."windowStartsAt" END
      RETURNING "count", "windowStartsAt"`;
    const windowEndsAt = bucket.windowStartsAt.getTime() + windowSeconds * 1000;
    return {
      isAllowed: bucket.count <= limit,
      retryAfterSeconds: Math.max(1, Math.ceil((windowEndsAt - Date.now()) / 1000)),
    };
  }
}
