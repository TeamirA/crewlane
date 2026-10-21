import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function deleteProject(
  dependencies: Pick<AppDependencies, "projects" | "members">,
  actorId: string,
  projectId: string,
): Promise<void> {
  await requireProjectMembership(dependencies, projectId, actorId, "OWNER");
  await dependencies.projects.delete(projectId);
}
