import type { UserSummary } from "./user";

export interface Comment {
  id: string;
  taskId: string;
  body: string;
  editedAt: Date | null;
  createdAt: Date;
  author: UserSummary;
}
