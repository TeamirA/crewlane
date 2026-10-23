import { calculatePositionAtIndex } from "@/core/domain/services/positioning";
import type { BoardDto, ColumnDto, TaskDto } from "@/types/board";

export function sortByPosition<TItem extends { position: number }>(items: TItem[]): TItem[] {
  return [...items].sort((first, second) => first.position - second.position);
}

export function getColumnTasks(board: BoardDto, columnId: string): TaskDto[] {
  return sortByPosition(board.tasks.filter((task) => task.columnId === columnId));
}

export function upsertTask(board: BoardDto, task: TaskDto): BoardDto {
  const hasTask = board.tasks.some((existingTask) => existingTask.id === task.id);
  const tasks = hasTask
    ? board.tasks.map((existingTask) => (existingTask.id === task.id ? task : existingTask))
    : [...board.tasks, task];
  return { ...board, tasks };
}

export function removeTask(board: BoardDto, taskId: string): BoardDto {
  return { ...board, tasks: board.tasks.filter((task) => task.id !== taskId) };
}

export function replaceColumns(board: BoardDto, columns: ColumnDto[]): BoardDto {
  const columnIds = new Set(columns.map((column) => column.id));
  return {
    ...board,
    columns: sortByPosition(columns),
    tasks: board.tasks.filter((task) => columnIds.has(task.columnId)),
  };
}

// Mirrors the server's placement so optimistic moves land where the server will put them.
export function moveTaskInBoard(
  board: BoardDto,
  taskId: string,
  columnId: string,
  targetIndex: number,
): BoardDto {
  const task = board.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return board;
  const siblings = getColumnTasks(board, columnId).filter((sibling) => sibling.id !== taskId);
  const position =
    calculatePositionAtIndex(
      siblings.map((sibling) => sibling.position),
      targetIndex,
    ) ?? (siblings[targetIndex - 1]?.position ?? 0) + 1e-9;
  return upsertTask(board, { ...task, columnId, position });
}

export function moveColumnInBoard(board: BoardDto, columnId: string, targetIndex: number) {
  const column = board.columns.find((candidate) => candidate.id === columnId);
  if (!column) return board;
  const otherColumns = board.columns.filter((candidate) => candidate.id !== columnId);
  const position =
    calculatePositionAtIndex(
      otherColumns.map((candidate) => candidate.position),
      targetIndex,
    ) ?? column.position;
  return replaceColumns(board, [...otherColumns, { ...column, position }]);
}
