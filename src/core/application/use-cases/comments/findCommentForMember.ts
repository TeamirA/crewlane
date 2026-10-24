import type { Comment } from "../../../domain/entities/comment";
import type { Task } from "../../../domain/entities/task";
import { ForbiddenError, NotFoundError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";
import { findTaskForMember } from "../tasks/findTaskForMember";

type CommentAccessDependencies = Pick<
  AppDependencies,
  "comments" | "tasks" | "members" | "projects"
>;

export async function findOwnCommentForMember(
  dependencies: CommentAccessDependencies,
  actorId: string,
  commentId: string,
): Promise<{ comment: Comment; task: Task }> {
  const comment = await dependencies.comments.findById(commentId);
  if (!comment) {
    throw new NotFoundError("Comment not found");
  }
  const task = await findTaskForMember(dependencies, actorId, comment.taskId);
  if (comment.author.id !== actorId) {
    throw new ForbiddenError("You can only change your own comments");
  }
  return { comment, task };
}
