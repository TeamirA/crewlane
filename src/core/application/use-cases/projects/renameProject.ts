import type { Project } from "../../../domain/entities/project";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";
import type { UpdateProjectInput } from "../../schemas/projectSchemas";

export async function renameProject(
  dependencies: Pick<AppDependencies, "projects" | "members">,
  actorId: string,
  projectId: string,
  input: UpdateProjectInput,
): Promise<Project> {
  await requireProjectMembership(dependencies, projectId, actorId, "OWNER");
  return dependencies.projects.update(projectId, input);
}
