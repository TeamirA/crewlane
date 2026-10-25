import type { ActivityLog } from "../../../domain/entities/activityLog";
import type { AppDependencies } from "../../ports";
import { findTaskForMember } from "../tasks/findTaskForMember";

const TASK_ACTIVITY_LIMIT = 30;

export async function listTaskActivity(
  dependencies: Pick<AppDependencies, "activity" | "tasks" | "members" | "projects">,
  actorId: string,
  taskId: string,
): Promise<ActivityLog[]> {
  await findTaskForMember(dependencies, actorId, taskId);
  return dependencies.activity.listByTask(taskId, TASK_ACTIVITY_LIMIT);
}
