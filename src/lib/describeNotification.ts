import type { NotificationDto } from "@/types/notification";

export function describeNotification(notification: NotificationDto): string {
  const actorName = notification.actor?.displayName ?? "Someone";
  const taskTitle = notification.taskTitle ? `“${notification.taskTitle}”` : "a task";
  switch (notification.type) {
    case "TASK_ASSIGNED":
      return `${actorName} assigned you to ${taskTitle}`;
    case "COMMENT_MENTION":
      return `${actorName} mentioned you on ${taskTitle}`;
    case "TASK_COMMENTED":
      return `${actorName} commented on ${taskTitle}`;
  }
}

export function getNotificationHref(notification: NotificationDto): string {
  const taskQuery = notification.taskId ? `?task=${notification.taskId}` : "";
  return `/projects/${notification.projectId}${taskQuery}`;
}
