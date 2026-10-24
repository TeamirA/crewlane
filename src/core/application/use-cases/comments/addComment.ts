import type { Comment } from "../../../domain/entities/comment";
import type { AppDependencies } from "../../ports";
import type { CommentBodyInput } from "../../schemas/commentSchemas";
import { findTaskForMember } from "../tasks/findTaskForMember";

export type AddCommentDependencies = Pick<
  AppDependencies,
  "comments" | "tasks" | "members" | "projects" | "users" | "activity" | "realtime"
>;

export async function addComment(
  dependencies: AddCommentDependencies,
  actorId: string,
  taskId: string,
  { body }: CommentBodyInput,
): Promise<Comment> {
  const task = await findTaskForMember(dependencies, actorId, taskId);
  const comment = await dependencies.comments.create(taskId, actorId, body);
  await dependencies.activity.record({
    projectId: task.projectId,
    taskId,
    actorId,
    type: "COMMENT_ADDED",
  });
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "comment.added",
    actorId,
    payload: { comment, taskId },
  });
  return comment;
}
