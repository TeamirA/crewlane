"use client";

import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useDeleteComment, useEditComment } from "@/hooks/useTaskComments";
import { formatRelativeTime } from "@/lib/formatting";
import type { CommentDto } from "@/types/comment";
import type { UserSummaryDto } from "@/types/user";

import { CommentComposer } from "./CommentComposer";
import { MentionText } from "./MentionText";

interface CommentItemProps {
  projectId: string;
  comment: CommentDto;
  isOwnComment: boolean;
  members: UserSummaryDto[];
  memberUsernames: Set<string>;
}

export function CommentItem(props: CommentItemProps) {
  const { projectId, comment, isOwnComment, members, memberUsernames } = props;
  const [isEditing, setIsEditing] = useState(false);
  const editComment = useEditComment(comment.taskId);
  const deleteComment = useDeleteComment(projectId, comment.taskId);
  return (
    <li className="flex gap-3">
      <Avatar name={comment.author.displayName} seed={comment.author.id} />
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-medium">{comment.author.displayName}</span>{" "}
          <time dateTime={comment.createdAt} className="text-xs text-neutral-500">
            {formatRelativeTime(comment.createdAt)}
          </time>
          {comment.editedAt && <span className="text-xs text-neutral-500"> · edited</span>}
        </p>
        {isEditing ? (
          <CommentComposer
            members={members}
            initialBody={comment.body}
            submitLabel="Save"
            isSubmitting={editComment.isPending}
            errorMessage={editComment.error?.message}
            onSubmit={(body) =>
              editComment.mutate(
                { commentId: comment.id, body },
                { onSuccess: () => setIsEditing(false) },
              )
            }
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <MentionText text={comment.body} memberUsernames={memberUsernames} />
        )}
        {isOwnComment && !isEditing && (
          <div className="mt-1 flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteComment.mutate(comment.id)}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
