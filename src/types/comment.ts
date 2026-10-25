import type { UserSummaryDto } from "./user";

export interface CommentDto {
  id: string;
  taskId: string;
  body: string;
  editedAt: string | null;
  createdAt: string;
  author: UserSummaryDto;
}
