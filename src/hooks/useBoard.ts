"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { BoardDto } from "@/types/board";

export function useBoard(projectId: string) {
  return useQuery({
    queryKey: queryKeys.board(projectId),
    queryFn: () => apiRequest<BoardDto>(`/api/projects/${projectId}/board`),
  });
}

export function useBoardCacheUpdater(projectId: string) {
  const queryClient = useQueryClient();
  return (updateBoard: (board: BoardDto) => BoardDto) =>
    queryClient.setQueryData<BoardDto>(queryKeys.board(projectId), (board) =>
      board ? updateBoard(board) : board,
    );
}
