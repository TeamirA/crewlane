import type { Task } from "../../../domain/entities/task";
import type { AppDependencies } from "../../ports";
import type { UpdateTaskInput } from "../../schemas/taskSchemas";

import { findTaskForMember } from "./findTaskForMember";
import { validateTaskRelations } from "./validateTaskRelations";

export type UpdateTaskDependencies = Pick<
  AppDependencies,
  "tasks" | "members" | "projects" | "labels" | "activity" | "realtime"
>;

export async function updateTask(
  dependencies: UpdateTaskDependencies,
  actorId: string,
  taskId: string,
  input: UpdateTaskInput,
): Promise<Task> {
  const existingTask = await findTaskForMember(dependencies, actorId, taskId);
  await validateTaskRelations(dependencies, existingTask.projectId, input);
  const task = await dependencies.tasks.update(taskId, input);
  await dependencies.activity.record({
    projectId: task.projectId,
    taskId,
    actorId,
    type: input.assigneeIds && Object.keys(input).length === 1 ? "TASK_ASSIGNED" : "TASK_UPDATED",
    metadata: { fields: Object.keys(input).join(", ") },
  });
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "task.updated",
    actorId,
    payload: { task },
  });
  return task;
}
