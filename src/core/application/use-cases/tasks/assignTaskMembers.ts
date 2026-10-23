import type { Task } from "../../../domain/entities/task";
import type { AssignTaskMembersInput } from "../../schemas/taskSchemas";

import { updateTask, type UpdateTaskDependencies } from "./updateTask";

export function assignTaskMembers(
  dependencies: UpdateTaskDependencies,
  actorId: string,
  taskId: string,
  { assigneeIds }: AssignTaskMembersInput,
): Promise<Task> {
  return updateTask(dependencies, actorId, taskId, { assigneeIds });
}
