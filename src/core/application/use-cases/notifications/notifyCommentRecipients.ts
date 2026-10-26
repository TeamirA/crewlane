import type { Comment } from "../../../domain/entities/comment";
import type { Task } from "../../../domain/entities/task";
import type { UserSummary } from "../../../domain/entities/user";
import type { CreateNotificationData } from "../../../domain/repositories/notificationRepository";
import type { AppDependencies } from "../../ports";

import { notifyUsers } from "./notifyUsers";

// Mentioned members get a mention; other assignees get a "new comment" notice, never both.
export function buildCommentNotifications(
  task: Task,
  comment: Comment,
  mentionedMembers: UserSummary[],
): CreateNotificationData[] {
  const authorId = comment.author.id;
  const mentionedIds = new Set(mentionedMembers.map((member) => member.id));
  const base = { actorId: authorId, projectId: task.projectId, taskId: task.id };
  const mentions = [...mentionedIds].map((recipientId) => ({
    ...base,
    recipientId,
    type: "COMMENT_MENTION" as const,
    commentId: comment.id,
  }));
  const assigneeNotices = task.assignees
    .filter((assignee) => assignee.id !== authorId && !mentionedIds.has(assignee.id))
    .map((assignee) => ({
      ...base,
      recipientId: assignee.id,
      type: "TASK_COMMENTED" as const,
      commentId: comment.id,
    }));
  return [...mentions, ...assigneeNotices];
}

export function notifyCommentRecipients(
  dependencies: Pick<AppDependencies, "notifications" | "realtime">,
  task: Task,
  comment: Comment,
  mentionedMembers: UserSummary[],
): Promise<void> {
  return notifyUsers(dependencies, buildCommentNotifications(task, comment, mentionedMembers));
}
