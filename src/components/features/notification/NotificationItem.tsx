"use client";

import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import { describeNotification, getNotificationHref } from "@/lib/describeNotification";
import { formatRelativeTime } from "@/lib/formatting";
import type { NotificationDto } from "@/types/notification";

interface NotificationItemProps {
  notification: NotificationDto;
  onOpen: (notification: NotificationDto) => void;
}

export function NotificationItem({ notification, onOpen }: NotificationItemProps) {
  const isUnread = !notification.readAt;
  return (
    <li>
      <Link
        href={getNotificationHref(notification)}
        onClick={() => onOpen(notification)}
        className={cn(
          "flex gap-3 px-4 py-3 text-sm hover:bg-neutral-50",
          isUnread && "bg-indigo-50/60",
        )}
      >
        {notification.actor && (
          <Avatar name={notification.actor.displayName} seed={notification.actor.id} size="sm" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block text-neutral-800">{describeNotification(notification)}</span>
          <time dateTime={notification.createdAt} className="text-xs text-neutral-500">
            {formatRelativeTime(notification.createdAt)}
          </time>
        </span>
        {isUnread && (
          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-indigo-600">
            <span className="sr-only">Unread</span>
          </span>
        )}
      </Link>
    </li>
  );
}
