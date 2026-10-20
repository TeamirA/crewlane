import { ConflictError } from "../../../domain/errors/domainErrors";
import type { AuthSession } from "../../dtos/authDtos";
import type { AppDependencies } from "../../ports";
import type { RegisterInput } from "../../schemas/authSchemas";

import { issueSession } from "./issueSession";

type RegisterUserDependencies = Pick<
  AppDependencies,
  "users" | "passwordHasher" | "tokens" | "refreshTokens"
>;

export async function registerUser(
  dependencies: RegisterUserDependencies,
  { password, ...profile }: RegisterInput,
): Promise<AuthSession> {
  const { users, passwordHasher } = dependencies;
  const isTaken = await users.existsWithEmailOrUsername(profile.email, profile.username);
  if (isTaken) {
    throw new ConflictError("An account with this email or username already exists");
  }
  const passwordHash = await passwordHasher.hash(password);
  const user = await users.create({ ...profile, passwordHash });
  return issueSession(dependencies, user);
}
