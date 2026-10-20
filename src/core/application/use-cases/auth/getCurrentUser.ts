import type { User } from "../../../domain/entities/user";
import { NotFoundError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";

export async function getCurrentUser(
  { users }: Pick<AppDependencies, "users">,
  userId: string,
): Promise<User> {
  const user = await users.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}
