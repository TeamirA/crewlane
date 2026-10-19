import type { Comment } from "../entities/comment";

export interface CommentRepository {
  listByTask(taskId: string): Promise<Comment[]>;
  findById(commentId: string): Promise<Comment | null>;
  create(taskId: string, authorId: string, body: string): Promise<Comment>;
  updateBody(commentId: string, body: string): Promise<Comment>;
  delete(commentId: string): Promise<void>;
}
