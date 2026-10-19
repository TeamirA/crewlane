import type { ActivityLog, ActivityMetadata, ActivityType } from "../entities/activityLog";

export interface RecordActivityData {
  projectId: string;
  taskId?: string | null;
  actorId: string;
  type: ActivityType;
  metadata?: ActivityMetadata;
}

export interface ActivityLogRepository {
  record(data: RecordActivityData): Promise<void>;
  listByTask(taskId: string, limit: number): Promise<ActivityLog[]>;
}
