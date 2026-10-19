export interface AccessTokenPayload {
  userId: string;
}

export interface IssuedRefreshToken {
  token: string;
  tokenHash: string;
  expiresAt: Date;
}

export interface TokenService {
  signAccessToken(payload: AccessTokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessTokenPayload | null>;
  issueRefreshToken(): IssuedRefreshToken;
  hashRefreshToken(token: string): string;
}
