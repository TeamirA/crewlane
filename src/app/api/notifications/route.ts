import { listNotifications } from "@/core/application/use-cases/notifications/listNotifications";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

export const GET = createApiHandler(async (request) => {
  const userId = await requireUserId(request);
  return respondWithData(await listNotifications(getDependencies(), userId));
});
