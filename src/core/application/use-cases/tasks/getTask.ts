import type { Task } from "../../../domain/entities/task";
import type { AppDependencies } from "../../ports";

import { findTaskForMember } from "./findTaskForMember";

export function getTask(
  dependencies: Pick<AppDependencies, "tasks" | "members" | "projects">,
  actorId: string,
  taskId: string,
): Promise<Task> {
  return findTaskForMember(dependencies, actorId, taskId);
}
