import type { ProjectMember } from "../../../domain/entities/projectMember";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function listProjectMembers(
  dependencies: Pick<AppDependencies, "projects" | "members">,
  actorId: string,
  projectId: string,
): Promise<ProjectMember[]> {
  await requireProjectMembership(dependencies, projectId, actorId);
  return dependencies.members.listByProject(projectId);
}
