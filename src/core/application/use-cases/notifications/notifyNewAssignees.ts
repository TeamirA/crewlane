import type { Task } from "../../../domain/entities/task";
import type { AppDependencies } from "../../ports";

import { notifyUsers } from "./notifyUsers";

export async function notifyNewAssignees(
  dependencies: Pick<AppDependencies, "notifications" | "realtime">,
  actorId: string,
  task: Task,
  previousAssigneeIds: string[],
): Promise<void> {
  const newAssigneeIds = task.assignees
    .map((assignee) => assignee.id)
    .filter((userId) => userId !== actorId && !previousAssigneeIds.includes(userId));
  await notifyUsers(
    dependencies,
    newAssigneeIds.map((recipientId) => ({
      recipientId,
      actorId,
      type: "TASK_ASSIGNED" as const,
      projectId: task.projectId,
      taskId: task.id,
    })),
  );
}
