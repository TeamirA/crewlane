import type { Prisma } from "@prisma/client";

import type { Task } from "@/core/domain/entities/task";

import type { taskInclude } from "./selects";

type TaskRecord = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

export function mapTask(record: TaskRecord): Task {
  return {
    id: record.id,
    projectId: record.projectId,
    columnId: record.columnId,
    title: record.title,
    description: record.description,
    position: record.position,
    priority: record.priority,
    dueDate: record.dueDate,
    createdById: record.createdById,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    assignees: record.assignees.map((assignee) => assignee.user),
    labels: record.labels.map((taskLabel) => taskLabel.label),
    commentCount: record._count.comments,
  };
}
