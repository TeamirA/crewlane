"use client";

import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { ActivityLogDto } from "@/types/activity";

export function useTaskActivity(taskId: string, taskUpdatedAt: string) {
  return useQuery({
    // Including updatedAt refetches the log whenever the task changes.
    queryKey: [...queryKeys.taskActivity(taskId), taskUpdatedAt],
    queryFn: async () =>
      (await apiRequest<{ activity: ActivityLogDto[] }>(`/api/tasks/${taskId}/activity`)).activity,
  });
}
