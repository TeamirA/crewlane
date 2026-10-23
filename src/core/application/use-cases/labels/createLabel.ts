import type { Label } from "../../../domain/entities/label";
import { ConflictError } from "../../../domain/errors/domainErrors";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";
import type { CreateLabelInput } from "../../schemas/labelSchemas";

export async function createLabel(
  dependencies: Pick<AppDependencies, "labels" | "members" | "projects">,
  actorId: string,
  projectId: string,
  { name, color }: CreateLabelInput,
): Promise<Label> {
  await requireProjectMembership(dependencies, projectId, actorId);
  const existingLabels = await dependencies.labels.listByProject(projectId);
  if (existingLabels.some((label) => label.name.toLowerCase() === name.toLowerCase())) {
    throw new ConflictError(`A label named "${name}" already exists`);
  }
  return dependencies.labels.create(projectId, name, color);
}
