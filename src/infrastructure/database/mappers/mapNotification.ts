import type { Prisma } from "@prisma/client";

import type { Notification } from "@/core/domain/entities/notification";

import type { notificationInclude } from "./selects";

type NotificationRecord = Prisma.NotificationGetPayload<{ include: typeof notificationInclude }>;

export function mapNotification(record: NotificationRecord): Notification {
  return {
    id: record.id,
    recipientId: record.recipientId,
    type: record.type,
    projectId: record.projectId,
    taskId: record.taskId,
    commentId: record.commentId,
    readAt: record.readAt,
    createdAt: record.createdAt,
    actor: record.actor,
    taskTitle: record.task?.title ?? null,
  };
}
