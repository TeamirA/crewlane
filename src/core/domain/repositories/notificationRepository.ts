import type { Notification, NotificationType } from "../entities/notification";

export interface CreateNotificationData {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  projectId: string;
  taskId: string;
  commentId?: string;
}

export interface NotificationRepository {
  createMany(data: CreateNotificationData[]): Promise<Notification[]>;
  listForUser(userId: string, limit: number): Promise<Notification[]>;
  countUnread(userId: string): Promise<number>;
  findById(notificationId: string): Promise<Notification | null>;
  markAsRead(notificationId: string): Promise<Notification>;
  markAllAsRead(userId: string): Promise<number>;
}
