import type { Task } from "../../../domain/entities/task";
import { NotFoundError } from "../../../domain/errors/domainErrors";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";

export async function findTaskForMember(
  dependencies: Pick<AppDependencies, "tasks" | "members" | "projects">,
  actorId: string,
  taskId: string,
): Promise<Task> {
  const task = await dependencies.tasks.findById(taskId);
  if (!task) {
    throw new NotFoundError("Task not found");
  }
  await requireProjectMembership(dependencies, task.projectId, actorId);
  return task;
}
