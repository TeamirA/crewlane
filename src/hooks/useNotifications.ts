"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/httpClient";
import {
  markFeedItemAsRead,
  markWholeFeedAsRead,
  prependNotification,
} from "@/lib/notificationCache";
import { queryKeys } from "@/lib/queryKeys";
import { toUserTopic } from "@/lib/realtimeTopics";
import type { NotificationDto, NotificationFeedDto } from "@/types/notification";

import { useCurrentUser } from "./useCurrentUser";
import { useRealtimeChannel } from "./useRealtimeChannel";

function useFeedUpdater() {
  const queryClient = useQueryClient();
  return (update: (feed: NotificationFeedDto) => NotificationFeedDto) =>
    queryClient.setQueryData<NotificationFeedDto>(queryKeys.notifications, (feed) =>
      feed ? update(feed) : feed,
    );
}

export function useNotifications() {
  const { data: currentUser } = useCurrentUser();
  const updateFeed = useFeedUpdater();
  const feedQuery = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => apiRequest<NotificationFeedDto>("/api/notifications"),
  });
  useRealtimeChannel(currentUser ? toUserTopic(currentUser.id) : null, ({ payload }) =>
    updateFeed((feed) => prependNotification(feed, payload.notification as NotificationDto)),
  );
  return feedQuery;
}

export function useMarkNotificationAsRead() {
  const updateFeed = useFeedUpdater();
  return useMutation({
    mutationFn: (notificationId: string) =>
      apiRequest(`/api/notifications/${notificationId}`, { method: "PATCH" }),
    onMutate: (notificationId) => updateFeed((feed) => markFeedItemAsRead(feed, notificationId)),
  });
}

export function useMarkAllNotificationsAsRead() {
  const updateFeed = useFeedUpdater();
  return useMutation({
    mutationFn: () => apiRequest("/api/notifications/read-all", { method: "POST" }),
    onMutate: () => updateFeed(markWholeFeedAsRead),
  });
}
