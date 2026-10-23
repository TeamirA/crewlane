import { updateTaskSchema } from "@/core/application/schemas/taskSchemas";
import { deleteTask } from "@/core/application/use-cases/tasks/deleteTask";
import { getTask } from "@/core/application/use-cases/tasks/getTask";
import { updateTask } from "@/core/application/use-cases/tasks/updateTask";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { taskId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  return respondWithData({ task: await getTask(getDependencies(), userId, taskId) });
});

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  const input = await parseRequestBody(request, updateTaskSchema);
  const task = await updateTask(getDependencies(), userId, taskId, input);
  return respondWithData({ task });
});

export const DELETE = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  await deleteTask(getDependencies(), userId, taskId);
  return respondWithData({ isDeleted: true });
});
