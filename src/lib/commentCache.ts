import type { CommentDto } from "@/types/comment";

export function upsertComment(comments: CommentDto[], comment: CommentDto): CommentDto[] {
  const hasComment = comments.some((existingComment) => existingComment.id === comment.id);
  return hasComment
    ? comments.map((existingComment) =>
        existingComment.id === comment.id ? comment : existingComment,
      )
    : [...comments, comment];
}

export function removeComment(comments: CommentDto[], commentId: string): CommentDto[] {
  return comments.filter((comment) => comment.id !== commentId);
}
