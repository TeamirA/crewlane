import type { UserSummary } from "./user";

export const ACTIVITY_TYPES = [
  "TASK_CREATED",
  "TASK_UPDATED",
  "TASK_MOVED",
  "TASK_DELETED",
  "TASK_ASSIGNED",
  "COMMENT_ADDED",
  "MEMBER_JOINED",
  "COLUMN_CREATED",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type ActivityMetadata = Record<string, string | number | boolean | null>;

export interface ActivityLog {
  id: string;
  projectId: string;
  taskId: string | null;
  type: ActivityType;
  metadata: ActivityMetadata | null;
  createdAt: Date;
  actor: UserSummary;
}
