import { createColumnSchema } from "@/core/application/schemas/columnSchemas";
import { createColumn } from "@/core/application/use-cases/columns/createColumn";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string };

export const POST = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const input = await parseRequestBody(request, createColumnSchema);
  const column = await createColumn(getDependencies(), userId, projectId, input);
  return respondWithData({ column }, 201);
});
