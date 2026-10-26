"use client";

import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Spinner } from "@/components/ui/Spinner";
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from "@/hooks/useNotifications";

import { BellIcon } from "./BellIcon";
import { NotificationItem } from "./NotificationItem";

export function NotificationBell() {
  const { data: feed, isPending, error } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const unreadCount = feed?.unreadCount ?? 0;
  const hasUnreadNotifications = unreadCount > 0;
  return (
    <Dropdown
      triggerLabel={`Notifications${hasUnreadNotifications ? `, ${unreadCount} unread` : ""}`}
      menuClassName="w-[min(22rem,calc(100vw-2rem))] p-0"
      triggerContent={<BellIcon unreadCount={unreadCount} />}
    >
      {(closeMenu) => (
        <div className="flex max-h-[70vh] flex-col">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <p className="text-sm font-semibold">Notifications</p>
            {hasUnreadNotifications && (
              <Button variant="ghost" size="sm" onClick={() => markAllAsRead.mutate()}>
                Mark all as read
              </Button>
            )}
          </div>
          {isPending && <Spinner className="m-4" label="Loading notifications" />}
          {error && <p className="p-4 text-sm text-red-600">Could not load notifications.</p>}
          {feed?.notifications.length === 0 && (
            <p className="p-4 text-sm text-neutral-500">You&apos;re all caught up.</p>
          )}
          <ul className="overflow-y-auto">
            {feed?.notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onOpen={(openedNotification) => {
                  if (!openedNotification.readAt) markAsRead.mutate(openedNotification.id);
                  closeMenu();
                }}
              />
            ))}
          </ul>
        </div>
      )}
    </Dropdown>
  );
}
