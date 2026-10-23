import type { BoardDto } from "@/types/board";

import { getColumnTasks } from "./boardCache";

const COLUMN_DROP_PREFIX = "column:";

export function toColumnDropId(columnId: string): string {
  return `${COLUMN_DROP_PREFIX}${columnId}`;
}

export interface DropTarget {
  columnId: string;
  targetIndex: number;
}

// Resolves a dnd-kit "over" id (a task or an empty column area) to a column and index.
export function resolveDropTarget(
  board: BoardDto,
  activeTaskId: string,
  overId: string,
): DropTarget | null {
  if (overId.startsWith(COLUMN_DROP_PREFIX)) {
    const columnId = overId.slice(COLUMN_DROP_PREFIX.length);
    const siblings = getColumnTasks(board, columnId).filter((task) => task.id !== activeTaskId);
    return { columnId, targetIndex: siblings.length };
  }
  const overTask = board.tasks.find((task) => task.id === overId);
  if (!overTask) return null;
  const columnTasks = getColumnTasks(board, overTask.columnId);
  return {
    columnId: overTask.columnId,
    targetIndex: columnTasks.findIndex((task) => task.id === overId),
  };
}
