import type { Task } from "../../../domain/entities/task";
import { ValidationError } from "../../../domain/errors/domainErrors";
import { calculatePositionAfterLast } from "../../../domain/services/positioning";
import { requireProjectMembership } from "../../policies/requireProjectMembership";
import type { AppDependencies } from "../../ports";
import type { CreateTaskInput } from "../../schemas/taskSchemas";

import { validateTaskRelations } from "./validateTaskRelations";

export type CreateTaskDependencies = Pick<
  AppDependencies,
  "tasks" | "columns" | "members" | "projects" | "labels" | "activity" | "realtime"
>;

export async function createTask(
  dependencies: CreateTaskDependencies,
  actorId: string,
  projectId: string,
  input: CreateTaskInput,
): Promise<Task> {
  await requireProjectMembership(dependencies, projectId, actorId);
  const column = await dependencies.columns.findById(input.columnId);
  if (!column || column.projectId !== projectId) {
    throw new ValidationError("Column does not belong to this project");
  }
  await validateTaskRelations(dependencies, projectId, input);
  const siblings = await dependencies.tasks.listPositionsInColumn(column.id);
  const task = await dependencies.tasks.create({
    ...input,
    projectId,
    description: input.description ?? null,
    dueDate: input.dueDate ?? null,
    position: calculatePositionAfterLast(siblings.map((sibling) => sibling.position)),
    createdById: actorId,
  });
  const activity = { projectId, taskId: task.id, actorId, metadata: { title: task.title } };
  await dependencies.activity.record({ ...activity, type: "TASK_CREATED" });
  await dependencies.realtime.publishToProject(projectId, {
    name: "task.created",
    actorId,
    payload: { task },
  });
  return task;
}
