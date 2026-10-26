"use client";

import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import type { BoardDto } from "@/types/board";

export interface BoardSnapshot {
  previousBoard?: BoardDto;
}

// Applies a board change immediately and returns a snapshot for rolling back on failure.
export function useOptimisticBoard(projectId: string) {
  const queryClient = useQueryClient();
  const boardKey = queryKeys.board(projectId);

  async function applyOptimisticUpdate(
    updateBoard: (board: BoardDto) => BoardDto,
  ): Promise<BoardSnapshot> {
    await queryClient.cancelQueries({ queryKey: boardKey });
    const previousBoard = queryClient.getQueryData<BoardDto>(boardKey);
    if (previousBoard) queryClient.setQueryData(boardKey, updateBoard(previousBoard));
    return { previousBoard };
  }

  // Restores the snapshot right away, then refetches so the board matches the server.
  function rollback(snapshot: BoardSnapshot | undefined) {
    if (snapshot?.previousBoard) {
      queryClient.setQueryData(boardKey, snapshot.previousBoard);
    }
    queryClient.invalidateQueries({ queryKey: boardKey });
  }

  return { applyOptimisticUpdate, rollback };
}
