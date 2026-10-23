import type { Label } from "../../../domain/entities/label";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function listProjectLabels(
  dependencies: Pick<AppDependencies, "labels" | "members" | "projects">,
  actorId: string,
  projectId: string,
): Promise<Label[]> {
  await requireProjectMembership(dependencies, projectId, actorId);
  return dependencies.labels.listByProject(projectId);
}
