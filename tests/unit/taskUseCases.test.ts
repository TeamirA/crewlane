import { describe, expect, it, vi } from "vitest";

import type { AppDependencies } from "@/core/application/ports";
import { buildCommentNotifications } from "@/core/application/use-cases/notifications/notifyCommentRecipients";
import { notifyNewAssignees } from "@/core/application/use-cases/notifications/notifyNewAssignees";
import { validateTaskRelations } from "@/core/application/use-cases/tasks/validateTaskRelations";
import { ValidationError } from "@/core/domain/errors/domainErrors";

import { buildTask } from "./fixtures/builders";

const person = (id: string) => ({ id, username: id, displayName: id });

describe("validateTaskRelations", () => {
  function createDependencies(memberCount: number, labelCount = 0) {
    return {
      members: { countMembersAmong: vi.fn().mockResolvedValue(memberCount) },
      labels: { countInProject: vi.fn().mockResolvedValue(labelCount) },
    } as unknown as Pick<AppDependencies, "members" | "labels">;
  }

  it("allows assigning project members", async () => {
    await expect(
      validateTaskRelations(createDependencies(2), "project-1", { assigneeIds: ["a", "b"] }),
    ).resolves.toBeUndefined();
  });

  it("rejects assignees who are not project members", async () => {
    await expect(
      validateTaskRelations(createDependencies(1), "project-1", { assigneeIds: ["a", "outsider"] }),
    ).rejects.toBeInstanceOf(ValidationError);
  });

  it("rejects labels from another project", async () => {
    await expect(
      validateTaskRelations(createDependencies(0, 0), "project-1", { labelIds: ["foreign"] }),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});

describe("notifyNewAssignees", () => {
  it("notifies only newly added assignees other than the actor", async () => {
    const dependencies = {
      notifications: { createMany: vi.fn().mockResolvedValue([]) },
      realtime: { publishToUser: vi.fn() },
    } as unknown as Pick<AppDependencies, "notifications" | "realtime">;
    const task = buildTask({ assignees: [person("actor"), person("existing"), person("new")] });
    await notifyNewAssignees(dependencies, "actor", task, ["existing"]);
    expect(dependencies.notifications.createMany).toHaveBeenCalledWith([
      expect.objectContaining({ recipientId: "new", type: "TASK_ASSIGNED" }),
    ]);
  });
});

describe("buildCommentNotifications", () => {
  it("sends mentions to mentioned members and comment notices to other assignees", () => {
    const task = buildTask({ assignees: [person("author"), person("mentioned"), person("other")] });
    const comment = {
      id: "comment-1",
      taskId: task.id,
      body: "@mentioned take a look",
      editedAt: null,
      createdAt: new Date(),
      author: person("author"),
    };
    const notifications = buildCommentNotifications(task, comment, [person("mentioned")]);
    expect(notifications.map(({ recipientId, type }) => [recipientId, type])).toEqual([
      ["mentioned", "COMMENT_MENTION"],
      ["other", "TASK_COMMENTED"],
    ]);
  });
});
