import type { ProjectMember, ProjectRole } from "@/core/domain/entities/projectMember";
import type { Task } from "@/core/domain/entities/task";
import type { User } from "@/core/domain/entities/user";

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: "user-1",
    email: "amara@crewlane.dev",
    username: "amara",
    displayName: "Amara Bekele",
    createdAt: new Date("2026-10-01T00:00:00Z"),
    ...overrides,
  };
}

export function buildMember(role: ProjectRole, userId = "user-1"): ProjectMember {
  return {
    id: `member-${userId}`,
    projectId: "project-1",
    role,
    joinedAt: new Date("2026-10-01T00:00:00Z"),
    user: { id: userId, username: userId, displayName: userId },
  };
}

export function buildTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    projectId: "project-1",
    columnId: "column-1",
    title: "Write launch announcement",
    description: null,
    position: 1000,
    priority: "MEDIUM",
    dueDate: null,
    createdById: "user-1",
    createdAt: new Date("2026-10-01T00:00:00Z"),
    updatedAt: new Date("2026-10-01T00:00:00Z"),
    assignees: [],
    labels: [],
    commentCount: 0,
    ...overrides,
  };
}
