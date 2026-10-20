import type { AppDependencies } from "../../ports";

type LogoutUserDependencies = Pick<AppDependencies, "tokens" | "refreshTokens">;

export async function logoutUser(
  { tokens, refreshTokens }: LogoutUserDependencies,
  presentedRefreshToken: string | undefined,
): Promise<void> {
  if (!presentedRefreshToken) {
    return;
  }
  const storedToken = await refreshTokens.findByTokenHash(
    tokens.hashRefreshToken(presentedRefreshToken),
  );
  if (storedToken) {
    await refreshTokens.revokeFamily(storedToken.familyId);
  }
}
