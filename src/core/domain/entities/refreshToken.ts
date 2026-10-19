export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  familyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export function isRefreshTokenUsable(token: RefreshToken, now: Date = new Date()): boolean {
  return token.revokedAt === null && token.expiresAt > now;
}
