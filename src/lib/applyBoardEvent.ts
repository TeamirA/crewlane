import type { BoardDto, ColumnDto, TaskDto } from "@/types/board";
import type { RealtimeMessage } from "@/types/realtime";

import {
  adjustTaskCommentCount,
  removeTask,
  replaceColumns,
  upsertTaskIfNewer,
} from "./boardCache";

type BoardEventHandler = (board: BoardDto, payload: Record<string, unknown>) => BoardDto;

const boardEventHandlers: Record<string, BoardEventHandler> = {
  "task.created": (board, payload) => upsertTaskIfNewer(board, payload.task as TaskDto),
  "task.updated": (board, payload) => upsertTaskIfNewer(board, payload.task as TaskDto),
  "task.moved": (board, payload) => upsertTaskIfNewer(board, payload.task as TaskDto),
  "task.deleted": (board, payload) => removeTask(board, payload.taskId as string),
  "column.changed": (board, payload) => replaceColumns(board, payload.columns as ColumnDto[]),
  "comment.added": (board, payload) => adjustTaskCommentCount(board, payload.taskId as string, 1),
  "comment.deleted": (board, payload) =>
    adjustTaskCommentCount(board, payload.taskId as string, -1),
};

export function applyBoardEvent(board: BoardDto, message: RealtimeMessage): BoardDto {
  const handler = boardEventHandlers[message.name];
  return handler ? handler(board, message.payload) : board;
}
