import { isRefreshTokenUsable } from "../../../domain/entities/refreshToken";
import { AuthenticationError } from "../../../domain/errors/domainErrors";
import type { AuthSession } from "../../dtos/authDtos";
import type { AppDependencies } from "../../ports";

import { issueSession } from "./issueSession";

type RefreshSessionDependencies = Pick<AppDependencies, "users" | "tokens" | "refreshTokens">;

export async function refreshSession(
  dependencies: RefreshSessionDependencies,
  presentedRefreshToken: string,
): Promise<AuthSession> {
  const { tokens, refreshTokens, users } = dependencies;
  const storedToken = await refreshTokens.findByTokenHash(
    tokens.hashRefreshToken(presentedRefreshToken),
  );
  if (!storedToken || !isRefreshTokenUsable(storedToken)) {
    throw new AuthenticationError("Session expired, please sign in again");
  }
  const user = await users.findById(storedToken.userId);
  if (!user) {
    throw new AuthenticationError("Session expired, please sign in again");
  }
  await refreshTokens.revoke(storedToken.id);
  return issueSession(dependencies, user, storedToken.familyId);
}
