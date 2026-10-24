import { commentBodySchema } from "@/core/application/schemas/commentSchemas";
import { addComment } from "@/core/application/use-cases/comments/addComment";
import { listTaskComments } from "@/core/application/use-cases/comments/listTaskComments";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { taskId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  const comments = await listTaskComments(getDependencies(), userId, taskId);
  return respondWithData({ comments });
});

export const POST = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { taskId } = await params;
  const input = await parseRequestBody(request, commentBodySchema);
  const comment = await addComment(getDependencies(), userId, taskId, input);
  return respondWithData({ comment }, 201);
});
