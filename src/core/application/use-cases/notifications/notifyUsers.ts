import type { CreateNotificationData } from "../../../domain/repositories/notificationRepository";
import type { AppDependencies } from "../../ports";

// Persists notifications first, then pushes each one to its recipient's private channel.
export async function notifyUsers(
  { notifications, realtime }: Pick<AppDependencies, "notifications" | "realtime">,
  pendingNotifications: CreateNotificationData[],
): Promise<void> {
  if (pendingNotifications.length === 0) return;
  const createdNotifications = await notifications.createMany(pendingNotifications);
  await Promise.all(
    createdNotifications.map((notification) =>
      realtime.publishToUser(notification.recipientId, {
        name: "notification.created",
        payload: { notification },
      }),
    ),
  );
}
