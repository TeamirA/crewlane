"use client";

import {
  type DragEndEvent,
  type DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { moveTaskInBoard } from "@/lib/boardCache";
import { type DropTarget, resolveDropTarget } from "@/lib/dragTargets";
import { queryKeys } from "@/lib/queryKeys";
import type { BoardDto } from "@/types/board";

import { useBoardCacheUpdater } from "./useBoard";
import { useMoveTask } from "./useTaskMutations";

function useBoardSensors() {
  return useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
}

// Moving across columns mid-drag lets the target column open a gap for the card.
function moveAcrossColumns(
  board: BoardDto,
  { active, over }: DragOverEvent,
  updateBoard: (update: (board: BoardDto) => BoardDto) => void,
) {
  const activeTask = board.tasks.find((task) => task.id === active.id);
  const target = over && resolveDropTarget(board, String(active.id), String(over.id));
  if (!activeTask || !target || target.columnId === activeTask.columnId) return;
  updateBoard((current) =>
    moveTaskInBoard(current, activeTask.id, target.columnId, target.targetIndex),
  );
}

function commitDrop(
  board: BoardDto,
  { active, over }: DragEndEvent,
  persistMove: (variables: DropTarget & { taskId: string }) => void,
) {
  const target = over && resolveDropTarget(board, String(active.id), String(over.id));
  if (target) persistMove({ taskId: String(active.id), ...target });
}

export function useBoardDragAndDrop(projectId: string, board: BoardDto) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const sensors = useBoardSensors();
  const queryClient = useQueryClient();
  const updateBoard = useBoardCacheUpdater(projectId);
  const moveTask = useMoveTask(projectId);
  const handlers = {
    onDragStart: ({ active }: { active: { id: string | number } }) =>
      setActiveTaskId(String(active.id)),
    onDragOver: (event: DragOverEvent) => moveAcrossColumns(board, event, updateBoard),
    onDragEnd: (event: DragEndEvent) => {
      setActiveTaskId(null);
      commitDrop(board, event, moveTask.mutate);
    },
    onDragCancel: () => {
      setActiveTaskId(null);
      queryClient.invalidateQueries({ queryKey: queryKeys.board(projectId) });
    },
  };
  const activeTask = board.tasks.find((task) => task.id === activeTaskId) ?? null;
  return { sensors, activeTask, handlers };
}
