"use client";

import { useQueryClient } from "@tanstack/react-query";

import { applyBoardEvent } from "@/lib/applyBoardEvent";
import { removeComment, upsertComment } from "@/lib/commentCache";
import { queryKeys } from "@/lib/queryKeys";
import { toProjectTopic } from "@/lib/realtimeTopics";
import type { CommentDto } from "@/types/comment";
import type { RealtimeMessage } from "@/types/realtime";

import { useBoardCacheUpdater } from "./useBoard";
import { useCurrentUser } from "./useCurrentUser";
import { useRealtimeChannel } from "./useRealtimeChannel";

function useCommentEventHandler() {
  const queryClient = useQueryClient();
  return ({ name, payload }: RealtimeMessage) => {
    const taskId = payload.taskId as string;
    queryClient.setQueryData<CommentDto[]>(queryKeys.taskComments(taskId), (comments) => {
      if (!comments) return comments;
      if (name === "comment.deleted") return removeComment(comments, payload.commentId as string);
      return upsertComment(comments, payload.comment as CommentDto);
    });
  };
}

export function useBoardRealtime(projectId: string) {
  const queryClient = useQueryClient();
  const updateBoard = useBoardCacheUpdater(projectId);
  const handleCommentEvent = useCommentEventHandler();
  const { data: currentUser } = useCurrentUser();

  useRealtimeChannel(toProjectTopic(projectId), (message) => {
    // Our own changes are already in the cache via optimistic updates; replaying them would
    // double-count comments and make dragged cards jump.
    if (message.actorId && message.actorId === currentUser?.id) return;
    updateBoard((board) => applyBoardEvent(board, message));
    if (message.name.startsWith("comment.")) handleCommentEvent(message);
    if (message.name === "member.joined") {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    }
  });
}
