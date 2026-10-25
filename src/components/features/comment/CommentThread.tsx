"use client";

import { Spinner } from "@/components/ui/Spinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAddComment, useTaskComments } from "@/hooks/useTaskComments";
import type { UserSummaryDto } from "@/types/user";

import { CommentComposer } from "./CommentComposer";
import { CommentItem } from "./CommentItem";

interface CommentThreadProps {
  projectId: string;
  taskId: string;
  members: UserSummaryDto[];
}

export function CommentThread({ projectId, taskId, members }: CommentThreadProps) {
  const { data: comments, isPending, error } = useTaskComments(taskId);
  const { data: currentUser } = useCurrentUser();
  const addComment = useAddComment(projectId, taskId);
  const memberUsernames = new Set(members.map((member) => member.username));
  return (
    <div className="flex flex-col gap-4">
      <CommentComposer
        members={members}
        submitLabel="Comment"
        isSubmitting={addComment.isPending}
        errorMessage={addComment.error?.message}
        onSubmit={(body, resetComposer) => addComment.mutate(body, { onSuccess: resetComposer })}
      />
      {isPending && <Spinner label="Loading comments" />}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          Could not load comments: {error.message}
        </p>
      )}
      {comments?.length === 0 && <p className="text-sm text-neutral-500">No comments yet.</p>}
      <ul className="flex flex-col gap-4">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            projectId={projectId}
            comment={comment}
            isOwnComment={comment.author.id === currentUser?.id}
            members={members}
            memberUsernames={memberUsernames}
          />
        ))}
      </ul>
    </div>
  );
}
