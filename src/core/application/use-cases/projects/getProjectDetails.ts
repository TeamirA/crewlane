import { NotFoundError } from "../../../domain/errors/domainErrors";
import type { ProjectDetails } from "../../dtos/projectDtos";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function getProjectDetails(
  dependencies: Pick<AppDependencies, "projects" | "members">,
  actorId: string,
  projectId: string,
): Promise<ProjectDetails> {
  const membership = await requireProjectMembership(dependencies, projectId, actorId);
  const [project, members] = await Promise.all([
    dependencies.projects.findById(projectId),
    dependencies.members.listByProject(projectId),
  ]);
  if (!project) {
    throw new NotFoundError("Project not found");
  }
  return { project, currentUserRole: membership.role, members };
}
