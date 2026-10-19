import type { UserSummary } from "./user";

export const NOTIFICATION_TYPES = ["TASK_ASSIGNED", "COMMENT_MENTION", "TASK_COMMENTED"] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  projectId: string;
  taskId: string | null;
  commentId: string | null;
  readAt: Date | null;
  createdAt: Date;
  actor: UserSummary | null;
  taskTitle: string | null;
}
