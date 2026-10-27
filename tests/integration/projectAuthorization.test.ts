import { beforeAll, describe, expect, it } from "vitest";

import { GET as getBoard } from "@/app/api/projects/[projectId]/board/route";
import { POST as inviteMember } from "@/app/api/projects/[projectId]/members/route";
import { GET as getProject } from "@/app/api/projects/[projectId]/route";
import { POST as createTask } from "@/app/api/projects/[projectId]/tasks/route";
import { GET as listProjects, POST as createProject } from "@/app/api/projects/route";

import { callRoute } from "./support/routeClient";
import { registerTestUser, type TestUser } from "./support/testUsers";

describe("project authorization", () => {
  let owner: TestUser;
  let outsider: TestUser;
  let projectId: string;

  beforeAll(async () => {
    [owner, outsider] = await Promise.all([
      registerTestUser("owner"),
      registerTestUser("outsider"),
    ]);
    const created = await callRoute(createProject, {
      method: "POST",
      cookie: owner.cookie,
      body: { name: "Integration project" },
    });
    projectId = (created.json.data?.project as { id: string }).id;
  });

  it("requires authentication", async () => {
    const response = await callRoute(listProjects);
    expect(response.status).toBe(401);
    expect(response.json.error).toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("returns 403 to users who are not project members", async () => {
    const params = { projectId };
    const [project, board, task] = await Promise.all([
      callRoute(getProject, { cookie: outsider.cookie, params }),
      callRoute(getBoard, { cookie: outsider.cookie, params }),
      callRoute(createTask, {
        method: "POST",
        cookie: outsider.cookie,
        params,
        body: { columnId: crypto.randomUUID(), title: "Sneaky" },
      }),
    ]);
    expect([project.status, board.status, task.status]).toEqual([403, 403, 403]);
  });

  it("returns 404 for a project that does not exist", async () => {
    const response = await callRoute(getProject, {
      cookie: owner.cookie,
      params: { projectId: crypto.randomUUID() },
    });
    expect(response.status).toBe(404);
  });

  it("gives invited members access to the board", async () => {
    const invited = await callRoute(inviteMember, {
      method: "POST",
      cookie: owner.cookie,
      params: { projectId },
      body: { identifier: outsider.username },
    });
    expect(invited.status).toBe(201);
    const board = await callRoute(getBoard, { cookie: outsider.cookie, params: { projectId } });
    expect(board.status).toBe(200);
    expect(board.json.data?.columns).toHaveLength(3);
  });

  it("rejects inviting someone who is already a member", async () => {
    const response = await callRoute(inviteMember, {
      method: "POST",
      cookie: owner.cookie,
      params: { projectId },
      body: { identifier: outsider.username },
    });
    expect(response.status).toBe(409);
  });
});
