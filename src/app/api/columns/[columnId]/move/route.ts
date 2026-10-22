import { moveColumnSchema } from "@/core/application/schemas/columnSchemas";
import { moveColumn } from "@/core/application/use-cases/columns/moveColumn";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { columnId: string };

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { columnId } = await params;
  const input = await parseRequestBody(request, moveColumnSchema);
  const column = await moveColumn(getDependencies(), userId, columnId, input);
  return respondWithData({ column });
});
