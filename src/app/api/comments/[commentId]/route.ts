import { commentBodySchema } from "@/core/application/schemas/commentSchemas";
import { deleteComment } from "@/core/application/use-cases/comments/deleteComment";
import { editComment } from "@/core/application/use-cases/comments/editComment";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { commentId: string };

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { commentId } = await params;
  const input = await parseRequestBody(request, commentBodySchema);
  const comment = await editComment(getDependencies(), userId, commentId, input);
  return respondWithData({ comment });
});

export const DELETE = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { commentId } = await params;
  await deleteComment(getDependencies(), userId, commentId);
  return respondWithData({ isDeleted: true });
});
