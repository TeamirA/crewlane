import type { Notification } from "../../../domain/entities/notification";
import { NotFoundError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";

export async function markNotificationAsRead(
  { notifications }: Pick<AppDependencies, "notifications">,
  actorId: string,
  notificationId: string,
): Promise<Notification> {
  const notification = await notifications.findById(notificationId);
  // Someone else's notification is reported as missing so its existence is not revealed.
  if (!notification || notification.recipientId !== actorId) {
    throw new NotFoundError("Notification not found");
  }
  if (notification.readAt) return notification;
  return notifications.markAsRead(notificationId);
}
