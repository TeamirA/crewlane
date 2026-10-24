import type { Comment } from "../../../domain/entities/comment";
import type { AppDependencies } from "../../ports";
import type { CommentBodyInput } from "../../schemas/commentSchemas";

import { findOwnCommentForMember } from "./findCommentForMember";

export async function editComment(
  dependencies: Pick<AppDependencies, "comments" | "tasks" | "members" | "projects" | "realtime">,
  actorId: string,
  commentId: string,
  { body }: CommentBodyInput,
): Promise<Comment> {
  const { task } = await findOwnCommentForMember(dependencies, actorId, commentId);
  const comment = await dependencies.comments.updateBody(commentId, body);
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "comment.updated",
    actorId,
    payload: { comment, taskId: task.id },
  });
  return comment;
}
