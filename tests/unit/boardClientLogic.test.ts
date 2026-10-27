import { describe, expect, it } from "vitest";

import { getColumnTasks, moveTaskInBoard, upsertTaskIfNewer } from "@/lib/boardCache";
import { resolveDropTarget, toColumnDropId } from "@/lib/dragTargets";
import { doesTaskMatchFilters, EMPTY_TASK_FILTERS } from "@/lib/taskFilters";
import type { BoardDto, TaskDto } from "@/types/board";

function buildTaskDto(id: string, columnId: string, position: number): TaskDto {
  return {
    id,
    projectId: "project-1",
    columnId,
    title: `Task ${id}`,
    description: null,
    position,
    priority: "MEDIUM",
    dueDate: null,
    createdById: "user-1",
    createdAt: "2026-10-01T00:00:00.000Z",
    updatedAt: "2026-10-01T00:00:00.000Z",
    assignees: [],
    labels: [],
    commentCount: 0,
  };
}

const board: BoardDto = {
  columns: [
    { id: "todo", projectId: "project-1", name: "To Do", position: 1000 },
    { id: "done", projectId: "project-1", name: "Done", position: 2000 },
  ],
  tasks: [
    buildTaskDto("a", "todo", 1000),
    buildTaskDto("b", "todo", 2000),
    buildTaskDto("c", "done", 1000),
  ],
  labels: [],
};

describe("moveTaskInBoard", () => {
  it("moves a card into another column at the requested index", () => {
    const movedBoard = moveTaskInBoard(board, "a", "done", 0);
    expect(getColumnTasks(movedBoard, "done").map((task) => task.id)).toEqual(["a", "c"]);
    expect(getColumnTasks(movedBoard, "todo").map((task) => task.id)).toEqual(["b"]);
  });

  it("reorders a card within its column", () => {
    const movedBoard = moveTaskInBoard(board, "b", "todo", 0);
    expect(getColumnTasks(movedBoard, "todo").map((task) => task.id)).toEqual(["b", "a"]);
  });
});

describe("resolveDropTarget", () => {
  it("drops onto the end of an empty column area", () => {
    expect(resolveDropTarget(board, "a", toColumnDropId("done"))).toEqual({
      columnId: "done",
      targetIndex: 1,
    });
  });

  it("drops at the index of the card underneath", () => {
    expect(resolveDropTarget(board, "c", "b")).toEqual({ columnId: "todo", targetIndex: 1 });
  });
});

describe("upsertTaskIfNewer", () => {
  it("ignores stale realtime snapshots", () => {
    const newerBoard = upsertTaskIfNewer(board, {
      ...board.tasks[0],
      title: "Newer",
      updatedAt: "2026-10-02T00:00:00.000Z",
    });
    const staleBoard = upsertTaskIfNewer(newerBoard, { ...board.tasks[0], title: "Stale" });
    expect(staleBoard.tasks[0].title).toBe("Newer");
  });
});

describe("doesTaskMatchFilters", () => {
  it("matches search text case-insensitively", () => {
    const filters = { ...EMPTY_TASK_FILTERS, searchText: "TASK A" };
    expect(doesTaskMatchFilters(board.tasks[0], filters)).toBe(true);
    expect(doesTaskMatchFilters(board.tasks[1], filters)).toBe(false);
  });
});
