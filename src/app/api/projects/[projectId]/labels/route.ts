import { createLabelSchema } from "@/core/application/schemas/labelSchemas";
import { createLabel } from "@/core/application/use-cases/labels/createLabel";
import { listProjectLabels } from "@/core/application/use-cases/labels/listProjectLabels";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const labels = await listProjectLabels(getDependencies(), userId, projectId);
  return respondWithData({ labels });
});

export const POST = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const input = await parseRequestBody(request, createLabelSchema);
  const label = await createLabel(getDependencies(), userId, projectId, input);
  return respondWithData({ label }, 201);
});
