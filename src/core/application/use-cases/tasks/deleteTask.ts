import type { AppDependencies } from "../../ports";

import { findTaskForMember } from "./findTaskForMember";

export async function deleteTask(
  dependencies: Pick<AppDependencies, "tasks" | "members" | "projects" | "activity" | "realtime">,
  actorId: string,
  taskId: string,
): Promise<void> {
  const task = await findTaskForMember(dependencies, actorId, taskId);
  await dependencies.tasks.delete(taskId);
  await dependencies.activity.record({
    projectId: task.projectId,
    actorId,
    type: "TASK_DELETED",
    metadata: { title: task.title },
  });
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "task.deleted",
    actorId,
    payload: { taskId, columnId: task.columnId },
  });
}
