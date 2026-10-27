import { describe, expect, it, vi } from "vitest";

import { requireProjectMembership } from "@/core/application/policies/requireProjectMembership";
import type { AppDependencies } from "@/core/application/ports";
import { ForbiddenError, NotFoundError } from "@/core/domain/errors/domainErrors";

import { buildMember } from "./fixtures/builders";

function createDependencies(membership: ReturnType<typeof buildMember> | null, hasProject = true) {
  return {
    members: { findMembership: vi.fn().mockResolvedValue(membership) },
    projects: { findById: vi.fn().mockResolvedValue(hasProject ? { id: "project-1" } : null) },
  } as unknown as Pick<AppDependencies, "members" | "projects">;
}

describe("requireProjectMembership", () => {
  it("returns the membership of a project member", async () => {
    const membership = buildMember("MEMBER");
    await expect(
      requireProjectMembership(createDependencies(membership), "project-1", "user-1"),
    ).resolves.toBe(membership);
  });

  it("rejects non-members of an existing project with a forbidden error", async () => {
    await expect(
      requireProjectMembership(createDependencies(null), "project-1", "user-1"),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("reports a missing project as not found", async () => {
    await expect(
      requireProjectMembership(createDependencies(null, false), "project-1", "user-1"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("enforces the minimum role", async () => {
    const dependencies = createDependencies(buildMember("ADMIN"));
    await expect(
      requireProjectMembership(dependencies, "project-1", "user-1", "OWNER"),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });
});
