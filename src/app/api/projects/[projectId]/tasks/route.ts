import { createTaskSchema } from "@/core/application/schemas/taskSchemas";
import { createTask } from "@/core/application/use-cases/tasks/createTask";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string };

export const POST = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const input = await parseRequestBody(request, createTaskSchema);
  const task = await createTask(getDependencies(), userId, projectId, input);
  return respondWithData({ task }, 201);
});
