import type { AppDependencies } from "../../ports";

import { findOwnCommentForMember } from "./findCommentForMember";

export async function deleteComment(
  dependencies: Pick<AppDependencies, "comments" | "tasks" | "members" | "projects" | "realtime">,
  actorId: string,
  commentId: string,
): Promise<void> {
  const { task } = await findOwnCommentForMember(dependencies, actorId, commentId);
  await dependencies.comments.delete(commentId);
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "comment.deleted",
    actorId,
    payload: { commentId, taskId: task.id },
  });
}
