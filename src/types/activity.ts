import type { UserSummaryDto } from "./user";

export interface ActivityLogDto {
  id: string;
  projectId: string;
  taskId: string | null;
  type: string;
  metadata: Record<string, string | number | boolean | null> | null;
  createdAt: string;
  actor: UserSummaryDto;
}
