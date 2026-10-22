import { renameColumnSchema } from "@/core/application/schemas/columnSchemas";
import { deleteColumn } from "@/core/application/use-cases/columns/deleteColumn";
import { renameColumn } from "@/core/application/use-cases/columns/renameColumn";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { columnId: string };

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { columnId } = await params;
  const input = await parseRequestBody(request, renameColumnSchema);
  const column = await renameColumn(getDependencies(), userId, columnId, input);
  return respondWithData({ column });
});

export const DELETE = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { columnId } = await params;
  await deleteColumn(getDependencies(), userId, columnId);
  return respondWithData({ isDeleted: true });
});
