import type { ActivityLogDto } from "@/types/activity";

const activityDescriptions: Record<string, (activity: ActivityLogDto) => string> = {
  TASK_CREATED: () => "created this task",
  TASK_UPDATED: (activity) => `updated ${activity.metadata?.fields ?? "the task"}`,
  TASK_MOVED: (activity) => `moved this task to ${activity.metadata?.toColumn ?? "another column"}`,
  TASK_ASSIGNED: () => "changed the assignees",
  COMMENT_ADDED: () => "added a comment",
};

export function describeActivity(activity: ActivityLogDto): string {
  return activityDescriptions[activity.type]?.(activity) ?? "made a change";
}
