import { describe, expect, it, vi } from "vitest";

import type { AppDependencies } from "@/core/application/ports";
import { loginUser } from "@/core/application/use-cases/auth/loginUser";
import { refreshSession } from "@/core/application/use-cases/auth/refreshSession";
import { registerUser } from "@/core/application/use-cases/auth/registerUser";
import { AuthenticationError, ConflictError } from "@/core/domain/errors/domainErrors";

import { buildUser } from "./fixtures/builders";

type AuthDependencies = Pick<
  AppDependencies,
  "users" | "passwordHasher" | "tokens" | "refreshTokens"
>;

function createAuthDependencies(overrides: Record<string, unknown> = {}) {
  return {
    users: {
      existsWithEmailOrUsername: vi.fn().mockResolvedValue(false),
      create: vi.fn().mockResolvedValue(buildUser()),
      findByEmailWithPasswordHash: vi
        .fn()
        .mockResolvedValue({ ...buildUser(), passwordHash: "hash" }),
      findById: vi.fn().mockResolvedValue(buildUser()),
    },
    passwordHasher: {
      hash: vi.fn().mockResolvedValue("hashed-password"),
      verify: vi.fn().mockResolvedValue(true),
    },
    tokens: {
      signAccessToken: vi.fn().mockResolvedValue("access-token"),
      issueRefreshToken: vi.fn().mockReturnValue({
        token: "refresh-token",
        tokenHash: "refresh-hash",
        expiresAt: new Date(Date.now() + 60_000),
      }),
      hashRefreshToken: vi.fn().mockReturnValue("presented-hash"),
    },
    refreshTokens: {
      create: vi.fn(),
      findByTokenHash: vi.fn(),
      revoke: vi.fn(),
      revokeFamily: vi.fn(),
    },
    ...overrides,
  } as unknown as AuthDependencies;
}

const registration = {
  email: "amara@crewlane.dev",
  username: "amara",
  displayName: "Amara Bekele",
  password: "correct horse",
};

describe("registerUser", () => {
  it("hashes the password and never stores it in plain text", async () => {
    const dependencies = createAuthDependencies();
    const session = await registerUser(dependencies, registration);
    expect(dependencies.users.create).toHaveBeenCalledWith(
      expect.objectContaining({ passwordHash: "hashed-password" }),
    );
    expect(dependencies.users.create).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: expect.anything() }),
    );
    expect(session.accessToken).toBe("access-token");
  });

  it("rejects a taken email or username", async () => {
    const dependencies = createAuthDependencies();
    vi.mocked(dependencies.users.existsWithEmailOrUsername).mockResolvedValue(true);
    await expect(registerUser(dependencies, registration)).rejects.toBeInstanceOf(ConflictError);
  });
});

describe("loginUser", () => {
  it("rejects a wrong password without revealing which field was wrong", async () => {
    const dependencies = createAuthDependencies();
    vi.mocked(dependencies.passwordHasher.verify).mockResolvedValue(false);
    await expect(
      loginUser(dependencies, { email: registration.email, password: "nope" }),
    ).rejects.toThrow(new AuthenticationError("Invalid email or password"));
  });
});

describe("refreshSession", () => {
  const storedToken = {
    id: "token-1",
    userId: "user-1",
    tokenHash: "presented-hash",
    familyId: "family-1",
    expiresAt: new Date(Date.now() + 60_000),
    revokedAt: null as Date | null,
  };

  it("rotates a valid refresh token within the same family", async () => {
    const dependencies = createAuthDependencies();
    vi.mocked(dependencies.refreshTokens.findByTokenHash).mockResolvedValue(storedToken);
    await refreshSession(dependencies, "refresh-token");
    expect(dependencies.refreshTokens.revoke).toHaveBeenCalledWith("token-1");
    expect(dependencies.refreshTokens.create).toHaveBeenCalledWith(
      expect.objectContaining({ familyId: "family-1" }),
    );
  });

  it("revokes the whole family when a rotated token is reused", async () => {
    const dependencies = createAuthDependencies();
    vi.mocked(dependencies.refreshTokens.findByTokenHash).mockResolvedValue({
      ...storedToken,
      revokedAt: new Date(),
    });
    await expect(refreshSession(dependencies, "refresh-token")).rejects.toBeInstanceOf(
      AuthenticationError,
    );
    expect(dependencies.refreshTokens.revokeFamily).toHaveBeenCalledWith("family-1");
  });
});
