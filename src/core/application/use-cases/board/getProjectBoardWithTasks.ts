import type { ProjectBoard } from "../../dtos/boardDtos";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function getProjectBoardWithTasks(
  dependencies: Pick<AppDependencies, "columns" | "tasks" | "labels" | "members" | "projects">,
  actorId: string,
  projectId: string,
): Promise<ProjectBoard> {
  await requireProjectMembership(dependencies, projectId, actorId);
  const [columns, tasks, labels] = await Promise.all([
    dependencies.columns.listByProject(projectId),
    dependencies.tasks.listByProject(projectId),
    dependencies.labels.listByProject(projectId),
  ]);
  return { columns, tasks, labels };
}
