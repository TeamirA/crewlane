import type { Task, TaskPriority } from "../entities/task";

export interface CreateTaskData {
  projectId: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  priority: TaskPriority;
  dueDate: Date | null;
  createdById: string;
  assigneeIds: string[];
  labelIds: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: Date | null;
  assigneeIds?: string[];
  labelIds?: string[];
}

export interface TaskPositionRecord {
  id: string;
  position: number;
}

export interface TaskRepository {
  findById(taskId: string): Promise<Task | null>;
  listByProject(projectId: string): Promise<Task[]>;
  listPositionsInColumn(columnId: string): Promise<TaskPositionRecord[]>;
  create(data: CreateTaskData): Promise<Task>;
  update(taskId: string, data: UpdateTaskData): Promise<Task>;
  move(taskId: string, columnId: string, position: number): Promise<Task>;
  rebalancePositions(orderedTaskIds: string[]): Promise<void>;
  delete(taskId: string): Promise<void>;
}
