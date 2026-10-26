import { markAllNotificationsAsRead } from "@/core/application/use-cases/notifications/markAllNotificationsAsRead";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

export const POST = createApiHandler(async (request) => {
  const userId = await requireUserId(request);
  return respondWithData(await markAllNotificationsAsRead(getDependencies(), userId));
});
