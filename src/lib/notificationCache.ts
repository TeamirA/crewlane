import type { NotificationDto, NotificationFeedDto } from "@/types/notification";

export function prependNotification(
  feed: NotificationFeedDto,
  notification: NotificationDto,
): NotificationFeedDto {
  if (feed.notifications.some((existing) => existing.id === notification.id)) return feed;
  return {
    notifications: [notification, ...feed.notifications],
    unreadCount: feed.unreadCount + (notification.readAt ? 0 : 1),
  };
}

export function markFeedItemAsRead(feed: NotificationFeedDto, notificationId: string) {
  const target = feed.notifications.find((notification) => notification.id === notificationId);
  if (!target || target.readAt) return feed;
  const readAt = new Date().toISOString();
  return {
    notifications: feed.notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, readAt } : notification,
    ),
    unreadCount: Math.max(0, feed.unreadCount - 1),
  };
}

export function markWholeFeedAsRead(feed: NotificationFeedDto): NotificationFeedDto {
  const readAt = new Date().toISOString();
  return {
    notifications: feed.notifications.map((notification) => ({
      ...notification,
      readAt: notification.readAt ?? readAt,
    })),
    unreadCount: 0,
  };
}
