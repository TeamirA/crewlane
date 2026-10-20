import { AuthenticationError } from "../../../domain/errors/domainErrors";
import type { AuthSession } from "../../dtos/authDtos";
import type { AppDependencies } from "../../ports";
import type { LoginInput } from "../../schemas/authSchemas";

import { issueSession } from "./issueSession";

type LoginUserDependencies = Pick<
  AppDependencies,
  "users" | "passwordHasher" | "tokens" | "refreshTokens"
>;

const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

export async function loginUser(
  dependencies: LoginUserDependencies,
  { email, password }: LoginInput,
): Promise<AuthSession> {
  const userWithHash = await dependencies.users.findByEmailWithPasswordHash(email);
  if (!userWithHash) {
    throw new AuthenticationError(INVALID_CREDENTIALS_MESSAGE);
  }
  const { passwordHash, ...user } = userWithHash;
  const isPasswordValid = await dependencies.passwordHasher.verify(password, passwordHash);
  if (!isPasswordValid) {
    throw new AuthenticationError(INVALID_CREDENTIALS_MESSAGE);
  }
  return issueSession(dependencies, user);
}
