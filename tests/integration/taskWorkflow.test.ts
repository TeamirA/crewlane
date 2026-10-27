import { beforeAll, describe, expect, it } from "vitest";

import { GET as listNotifications } from "@/app/api/notifications/route";
import { GET as getBoard } from "@/app/api/projects/[projectId]/board/route";
import { POST as inviteMember } from "@/app/api/projects/[projectId]/members/route";
import { POST as createTask } from "@/app/api/projects/[projectId]/tasks/route";
import { POST as createProject } from "@/app/api/projects/route";
import { POST as addComment } from "@/app/api/tasks/[taskId]/comments/route";
import { PATCH as moveTask } from "@/app/api/tasks/[taskId]/move/route";
import { PATCH as updateTask } from "@/app/api/tasks/[taskId]/route";

import { callRoute } from "./support/routeClient";
import { registerTestUser, type TestUser } from "./support/testUsers";

type BoardData = { columns: { id: string }[]; tasks: { id: string; columnId: string }[] };

describe("task workflow", () => {
  let owner: TestUser;
  let teammate: TestUser;
  let projectId: string;
  let board: BoardData;

  async function fetchBoard() {
    const response = await callRoute(getBoard, { cookie: owner.cookie, params: { projectId } });
    return response.json.data as unknown as BoardData;
  }

  async function addTask(title: string) {
    const response = await callRoute(createTask, {
      method: "POST",
      cookie: owner.cookie,
      params: { projectId },
      body: { columnId: board.columns[0].id, title },
    });
    return (response.json.data?.task as { id: string }).id;
  }

  beforeAll(async () => {
    [owner, teammate] = await Promise.all([registerTestUser("lead"), registerTestUser("mate")]);
    const created = await callRoute(createProject, {
      method: "POST",
      cookie: owner.cookie,
      body: { name: "Workflow project" },
    });
    projectId = (created.json.data?.project as { id: string }).id;
    await callRoute(inviteMember, {
      method: "POST",
      cookie: owner.cookie,
      params: { projectId },
      body: { identifier: teammate.username },
    });
    board = await fetchBoard();
  });

  it("persists card order after a move", async () => {
    const taskIds = [await addTask("First"), await addTask("Second"), await addTask("Third")];
    const moved = await callRoute(moveTask, {
      method: "PATCH",
      cookie: owner.cookie,
      params: { taskId: taskIds[2] },
      body: { columnId: board.columns[0].id, targetIndex: 0 },
    });
    expect(moved.status).toBe(200);
    const refreshedBoard = await fetchBoard();
    const orderedIds = refreshedBoard.tasks
      .filter((task) => task.columnId === board.columns[0].id)
      .map((task) => task.id);
    expect(orderedIds).toEqual([taskIds[2], taskIds[0], taskIds[1]]);
  });

  it("only allows project members as assignees", async () => {
    const taskId = await addTask("Assign me");
    const outsider = await registerTestUser("stranger");
    const response = await callRoute(updateTask, {
      method: "PATCH",
      cookie: owner.cookie,
      params: { taskId },
      body: { assigneeIds: [outsider.id] },
    });
    expect(response.status).toBe(400);
  });

  it("notifies assigned and mentioned teammates", async () => {
    const taskId = await addTask("Needs review");
    await callRoute(updateTask, {
      method: "PATCH",
      cookie: owner.cookie,
      params: { taskId },
      body: { assigneeIds: [teammate.id] },
    });
    await callRoute(addComment, {
      method: "POST",
      cookie: owner.cookie,
      params: { taskId },
      body: { body: `@${teammate.username} could you review this?` },
    });
    const feed = await callRoute(listNotifications, { cookie: teammate.cookie });
    const types = (feed.json.data?.notifications as { type: string }[]).map((item) => item.type);
    expect(types).toEqual(["COMMENT_MENTION", "TASK_ASSIGNED"]);
    expect(feed.json.data?.unreadCount).toBe(2);
  });
});
