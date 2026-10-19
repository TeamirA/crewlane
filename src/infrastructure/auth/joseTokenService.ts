import { createHmac, randomBytes } from "node:crypto";

import { jwtVerify, SignJWT } from "jose";

import type { AccessTokenPayload, TokenService } from "@/core/domain/services/tokenService";

import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from "./tokenLifetimes";

const ISSUER = "crewlane";
const AUDIENCE = "crewlane-app";

export class JoseTokenService implements TokenService {
  private readonly accessSecret: Uint8Array;

  constructor(
    accessSecret: string,
    private readonly refreshSecret: string,
  ) {
    this.accessSecret = new TextEncoder().encode(accessSecret);
  }

  signAccessToken({ userId }: AccessTokenPayload) {
    return new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
      .sign(this.accessSecret);
  }

  async verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.accessSecret, {
        issuer: ISSUER,
        audience: AUDIENCE,
        algorithms: ["HS256"],
      });
      return payload.sub ? { userId: payload.sub } : null;
    } catch {
      return null;
    }
  }

  issueRefreshToken() {
    const token = randomBytes(48).toString("base64url");
    return {
      token,
      tokenHash: this.hashRefreshToken(token),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    };
  }

  // Refresh tokens are stored only as keyed hashes so a database leak cannot replay sessions.
  hashRefreshToken(token: string) {
    return createHmac("sha256", this.refreshSecret).update(token).digest("hex");
  }
}
