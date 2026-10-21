import type { ProjectSummary } from "../../../domain/entities/project";
import type { AppDependencies } from "../../ports";

export function listProjectsForUser(
  { projects }: Pick<AppDependencies, "projects">,
  actorId: string,
): Promise<ProjectSummary[]> {
  return projects.findAllForUser(actorId);
}
