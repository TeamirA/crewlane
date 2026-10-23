import { moveTaskSchema } from "@/core/application/schemas/taskSchemas";
import { moveTask } from "@/core/application/use-cases/tasks/moveTask";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { taskId: string };

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  const input = await parseRequestBody(request, moveTaskSchema);
  const task = await moveTask(getDependencies(), userId, taskId, input);
  return respondWithData({ task });
});
