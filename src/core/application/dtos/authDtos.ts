import type { User } from "../../domain/entities/user";

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}
