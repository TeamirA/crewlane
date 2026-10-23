import { assignTaskMembersSchema } from "@/core/application/schemas/taskSchemas";
import { assignTaskMembers } from "@/core/application/use-cases/tasks/assignTaskMembers";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { taskId: string };

export const PUT = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  const input = await parseRequestBody(request, assignTaskMembersSchema);
  const task = await assignTaskMembers(getDependencies(), userId, taskId, input);
  return respondWithData({ task });
});
