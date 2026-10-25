import type { RealtimePublisher } from "@/core/domain/services/realtimePublisher";
import type { RealtimeTokenIssuer } from "@/core/domain/services/realtimeTokenIssuer";
import { ValidationError } from "@/core/domain/errors/domainErrors";

import type { ServerEnv } from "../config/serverEnv";

import { NoopRealtimePublisher } from "./noopRealtimePublisher";
import { SupabaseRealtimePublisher } from "./supabaseRealtimePublisher";
import { SupabaseRealtimeTokenIssuer } from "./supabaseRealtimeTokenIssuer";

const unavailableTokenIssuer: RealtimeTokenIssuer = {
  issueForUser: () => Promise.reject(new ValidationError("Realtime is not configured")),
};

export function createRealtimeServices(env: ServerEnv): {
  realtime: RealtimePublisher;
  realtimeTokens: RealtimeTokenIssuer;
} {
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_JWT_SECRET } = env;
  return {
    realtime:
      NEXT_PUBLIC_SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
        ? new SupabaseRealtimePublisher(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        : new NoopRealtimePublisher(),
    realtimeTokens: SUPABASE_JWT_SECRET
      ? new SupabaseRealtimeTokenIssuer(SUPABASE_JWT_SECRET)
      : unavailableTokenIssuer,
  };
}
