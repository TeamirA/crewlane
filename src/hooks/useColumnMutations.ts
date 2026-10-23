"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moveColumnInBoard } from "@/lib/boardCache";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";

import { useBoardCacheUpdater } from "./useBoard";

function useInvalidateBoard(projectId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.board(projectId) });
}

export function useCreateColumn(projectId: string) {
  const onSettled = useInvalidateBoard(projectId);
  return useMutation({
    mutationFn: (name: string) =>
      apiRequest(`/api/projects/${projectId}/columns`, { method: "POST", body: { name } }),
    onSettled,
  });
}

export function useRenameColumn(projectId: string) {
  const onSettled = useInvalidateBoard(projectId);
  return useMutation({
    mutationFn: ({ columnId, name }: { columnId: string; name: string }) =>
      apiRequest(`/api/columns/${columnId}`, { method: "PATCH", body: { name } }),
    onSettled,
  });
}

// Columns are reordered in the cache immediately so they do not jump back while saving.
export function useMoveColumn(projectId: string) {
  const onSettled = useInvalidateBoard(projectId);
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: ({ columnId, targetIndex }: { columnId: string; targetIndex: number }) =>
      apiRequest(`/api/columns/${columnId}/move`, { method: "PATCH", body: { targetIndex } }),
    onMutate: ({ columnId, targetIndex }) =>
      updateBoard((board) => moveColumnInBoard(board, columnId, targetIndex)),
    onSettled,
  });
}

export function useDeleteColumn(projectId: string) {
  const onSettled = useInvalidateBoard(projectId);
  return useMutation({
    mutationFn: (columnId: string) => apiRequest(`/api/columns/${columnId}`, { method: "DELETE" }),
    onSettled,
  });
}
