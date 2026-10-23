import type { Task } from "../../../domain/entities/task";
import { ValidationError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";
import type { MoveTaskInput } from "../../schemas/taskSchemas";

import { findTaskForMember } from "./findTaskForMember";
import { placeTaskInColumn } from "./placeTaskInColumn";

type MoveTaskDependencies = Pick<
  AppDependencies,
  "tasks" | "columns" | "members" | "projects" | "activity" | "realtime"
>;

export async function moveTask(
  dependencies: MoveTaskDependencies,
  actorId: string,
  taskId: string,
  { columnId, targetIndex }: MoveTaskInput,
): Promise<Task> {
  const existingTask = await findTaskForMember(dependencies, actorId, taskId);
  const targetColumn = await dependencies.columns.findById(columnId);
  if (!targetColumn || targetColumn.projectId !== existingTask.projectId) {
    throw new ValidationError("Column does not belong to this project");
  }
  const task = await placeTaskInColumn(dependencies.tasks, taskId, columnId, targetIndex);
  await dependencies.activity.record({
    projectId: task.projectId,
    taskId,
    actorId,
    type: "TASK_MOVED",
    metadata: { toColumn: targetColumn.name },
  });
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "task.moved",
    actorId,
    payload: { task, fromColumnId: existingTask.columnId },
  });
  return task;
}
