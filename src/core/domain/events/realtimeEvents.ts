export const BOARD_EVENT_NAMES = [
  "task.created",
  "task.updated",
  "task.moved",
  "task.deleted",
  "column.changed",
  "comment.added",
  "comment.updated",
  "comment.deleted",
  "member.joined",
] as const;

export type BoardEventName = (typeof BOARD_EVENT_NAMES)[number];

export interface BoardEvent {
  name: BoardEventName;
  actorId: string;
  payload: Record<string, unknown>;
}

export interface UserEvent {
  name: "notification.created";
  payload: Record<string, unknown>;
}
