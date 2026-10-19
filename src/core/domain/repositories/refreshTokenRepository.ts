import type { RefreshToken } from "../entities/refreshToken";

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
}

export interface RefreshTokenRepository {
  create(data: CreateRefreshTokenData): Promise<RefreshToken>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  revoke(tokenId: string): Promise<void>;
  revokeFamily(familyId: string): Promise<void>;
}
