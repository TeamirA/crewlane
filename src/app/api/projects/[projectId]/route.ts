import { updateProjectSchema } from "@/core/application/schemas/projectSchemas";
import { deleteProject } from "@/core/application/use-cases/projects/deleteProject";
import { getProjectDetails } from "@/core/application/use-cases/projects/getProjectDetails";
import { renameProject } from "@/core/application/use-cases/projects/renameProject";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  return respondWithData(await getProjectDetails(getDependencies(), userId, projectId));
});

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const input = await parseRequestBody(request, updateProjectSchema);
  const project = await renameProject(getDependencies(), userId, projectId, input);
  return respondWithData({ project });
});

export const DELETE = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  await deleteProject(getDependencies(), userId, projectId);
  return respondWithData({ isDeleted: true });
});
