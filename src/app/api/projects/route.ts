import { createProjectSchema } from "@/core/application/schemas/projectSchemas";
import { createProject } from "@/core/application/use-cases/projects/createProject";
import { listProjectsForUser } from "@/core/application/use-cases/projects/listProjectsForUser";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

export const GET = createApiHandler(async (request) => {
  const userId = await requireUserId(request);
  const projects = await listProjectsForUser(getDependencies(), userId);
  return respondWithData({ projects });
});

export const POST = createApiHandler(async (request) => {
  const userId = await requireUserId(request);
  const input = await parseRequestBody(request, createProjectSchema);
  const project = await createProject(getDependencies(), userId, input);
  return respondWithData({ project }, 201);
});
