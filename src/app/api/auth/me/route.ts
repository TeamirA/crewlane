import { getCurrentUser } from "@/core/application/use-cases/auth/getCurrentUser";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

export const GET = createApiHandler(async (request) => {
  const userId = await requireUserId(request);
  const user = await getCurrentUser(getDependencies(), userId);
  return respondWithData({ user });
});
