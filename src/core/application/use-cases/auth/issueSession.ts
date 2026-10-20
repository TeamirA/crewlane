import { randomUUID } from "node:crypto";

import type { User } from "../../../domain/entities/user";
import type { AuthSession } from "../../dtos/authDtos";
import type { AppDependencies } from "../../ports";

type IssueSessionDependencies = Pick<AppDependencies, "tokens" | "refreshTokens">;

export async function issueSession(
  { tokens, refreshTokens }: IssueSessionDependencies,
  user: User,
  familyId: string = randomUUID(),
): Promise<AuthSession> {
  const accessToken = await tokens.signAccessToken({ userId: user.id });
  const refreshToken = tokens.issueRefreshToken();
  await refreshTokens.create({
    userId: user.id,
    tokenHash: refreshToken.tokenHash,
    familyId,
    expiresAt: refreshToken.expiresAt,
  });
  return {
    user,
    accessToken,
    refreshToken: refreshToken.token,
    refreshTokenExpiresAt: refreshToken.expiresAt,
  };
}
