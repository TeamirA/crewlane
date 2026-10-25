"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { adjustTaskCommentCount } from "@/lib/boardCache";
import { removeComment, upsertComment } from "@/lib/commentCache";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { CommentDto } from "@/types/comment";

import { useBoardCacheUpdater } from "./useBoard";

type CommentResponse = { comment: CommentDto };

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: queryKeys.taskComments(taskId),
    queryFn: async () =>
      (await apiRequest<{ comments: CommentDto[] }>(`/api/tasks/${taskId}/comments`)).comments,
  });
}

function useCommentCacheUpdater(taskId: string) {
  const queryClient = useQueryClient();
  return (update: (comments: CommentDto[]) => CommentDto[]) =>
    queryClient.setQueryData<CommentDto[]>(queryKeys.taskComments(taskId), (comments) =>
      update(comments ?? []),
    );
}

export function useAddComment(projectId: string, taskId: string) {
  const updateComments = useCommentCacheUpdater(taskId);
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: (body: string) =>
      apiRequest<CommentResponse>(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        body: { body },
      }),
    onSuccess: ({ comment }) => {
      updateComments((comments) => upsertComment(comments, comment));
      updateBoard((board) => adjustTaskCommentCount(board, taskId, 1));
    },
  });
}

export function useEditComment(taskId: string) {
  const updateComments = useCommentCacheUpdater(taskId);
  return useMutation({
    mutationFn: ({ commentId, body }: { commentId: string; body: string }) =>
      apiRequest<CommentResponse>(`/api/comments/${commentId}`, {
        method: "PATCH",
        body: { body },
      }),
    onSuccess: ({ comment }) => updateComments((comments) => upsertComment(comments, comment)),
  });
}

export function useDeleteComment(projectId: string, taskId: string) {
  const updateComments = useCommentCacheUpdater(taskId);
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: (commentId: string) =>
      apiRequest(`/api/comments/${commentId}`, { method: "DELETE" }),
    onMutate: (commentId) => {
      updateComments((comments) => removeComment(comments, commentId));
      updateBoard((board) => adjustTaskCommentCount(board, taskId, -1));
    },
  });
}
