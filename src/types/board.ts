import type { UserSummaryDto } from "./user";

export type TaskPriorityDto = "LOW" | "MEDIUM" | "HIGH";

export interface ColumnDto {
  id: string;
  projectId: string;
  name: string;
  position: number;
}

export interface LabelDto {
  id: string;
  projectId: string;
  name: string;
  color: string;
}

export interface TaskDto {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  priority: TaskPriorityDto;
  dueDate: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  assignees: UserSummaryDto[];
  labels: LabelDto[];
  commentCount: number;
}

export interface BoardDto {
  columns: ColumnDto[];
  tasks: TaskDto[];
  labels: LabelDto[];
}
