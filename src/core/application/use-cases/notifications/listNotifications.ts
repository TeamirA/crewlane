import type { Notification } from "../../../domain/entities/notification";
import type { AppDependencies } from "../../ports";

const NOTIFICATION_LIST_LIMIT = 30;

export async function listNotifications(
  { notifications }: Pick<AppDependencies, "notifications">,
  actorId: string,
): Promise<{ notifications: Notification[]; unreadCount: number }> {
  const [recentNotifications, unreadCount] = await Promise.all([
    notifications.listForUser(actorId, NOTIFICATION_LIST_LIMIT),
    notifications.countUnread(actorId),
  ]);
  return { notifications: recentNotifications, unreadCount };
}
