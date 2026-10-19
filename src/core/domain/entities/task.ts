import type { Label } from "./label";
import type { UserSummary } from "./user";

export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface Task {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  priority: TaskPriority;
  dueDate: Date | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  assignees: UserSummary[];
  labels: Label[];
  commentCount: number;
}
