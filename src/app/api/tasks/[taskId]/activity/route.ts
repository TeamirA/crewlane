import { listTaskActivity } from "@/core/application/use-cases/activity/listTaskActivity";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { taskId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  const activity = await listTaskActivity(getDependencies(), userId, taskId);
  return respondWithData({ activity });
});
