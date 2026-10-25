import { SignJWT } from "jose";

import type { RealtimeTokenIssuer } from "@/core/domain/services/realtimeTokenIssuer";

const REALTIME_TOKEN_TTL_SECONDS = 60 * 60;

// Signs tokens with the Supabase project secret so Realtime treats the user as "authenticated".
export class SupabaseRealtimeTokenIssuer implements RealtimeTokenIssuer {
  private readonly secret: Uint8Array;

  constructor(jwtSecret: string) {
    this.secret = new TextEncoder().encode(jwtSecret);
  }

  async issueForUser(userId: string) {
    const expiresAt = new Date(Date.now() + REALTIME_TOKEN_TTL_SECONDS * 1000);
    const token = await new SignJWT({ role: "authenticated" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(userId)
      .setAudience("authenticated")
      .setIssuedAt()
      .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
      .sign(this.secret);
    return { token, expiresAt };
  }
}
