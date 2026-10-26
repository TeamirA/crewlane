import type { Comment } from "../../../domain/entities/comment";
import type { AppDependencies } from "../../ports";
import type { CommentBodyInput } from "../../schemas/commentSchemas";
import { notifyCommentRecipients } from "../notifications/notifyCommentRecipients";
import { findTaskForMember } from "../tasks/findTaskForMember";

import { resolveMentionedMembers } from "./resolveMentionedMembers";

export type AddCommentDependencies = Pick<
  AppDependencies,
  | "comments"
  | "tasks"
  | "members"
  | "projects"
  | "users"
  | "activity"
  | "realtime"
  | "notifications"
>;

export async function addComment(
  dependencies: AddCommentDependencies,
  actorId: string,
  taskId: string,
  { body }: CommentBodyInput,
): Promise<Comment> {
  const task = await findTaskForMember(dependencies, actorId, taskId);
  const comment = await dependencies.comments.create(taskId, actorId, body);
  const mentionedMembers = await resolveMentionedMembers(
    dependencies,
    task.projectId,
    actorId,
    body,
  );
  await dependencies.activity.record({
    projectId: task.projectId,
    taskId,
    actorId,
    type: "COMMENT_ADDED",
    metadata: { mentionCount: mentionedMembers.length },
  });
  await dependencies.realtime.publishToProject(task.projectId, {
    name: "comment.added",
    actorId,
    payload: { comment, taskId },
  });
  await notifyCommentRecipients(dependencies, task, comment, mentionedMembers);
  return comment;
}
