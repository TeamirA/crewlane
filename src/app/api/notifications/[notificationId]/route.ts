import { markNotificationAsRead } from "@/core/application/use-cases/notifications/markNotificationAsRead";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { notificationId: string };

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { notificationId } = await params;
  const notification = await markNotificationAsRead(getDependencies(), userId, notificationId);
  return respondWithData({ notification });
});
