import type { AppDependencies } from "../../ports";

export async function markAllNotificationsAsRead(
  { notifications }: Pick<AppDependencies, "notifications">,
  actorId: string,
): Promise<{ updatedCount: number }> {
  return { updatedCount: await notifications.markAllAsRead(actorId) };
}
