import type { UserSummaryDto } from "./user";

export type NotificationTypeDto = "TASK_ASSIGNED" | "COMMENT_MENTION" | "TASK_COMMENTED";

export interface NotificationDto {
  id: string;
  recipientId: string;
  type: NotificationTypeDto;
  projectId: string;
  taskId: string | null;
  commentId: string | null;
  readAt: string | null;
  createdAt: string;
  actor: UserSummaryDto | null;
  taskTitle: string | null;
}

export interface NotificationFeedDto {
  notifications: NotificationDto[];
  unreadCount: number;
}
