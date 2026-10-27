import { describe, expect, it } from "vitest";

import { POST as login } from "@/app/api/auth/login/route";
import { GET as getMe } from "@/app/api/auth/me/route";
import { POST as refresh } from "@/app/api/auth/refresh/route";

import { callRoute, toCookieHeader } from "./support/routeClient";
import { registerTestUser } from "./support/testUsers";

describe("authentication flow", () => {
  it("returns the current user without exposing the password hash", async () => {
    const user = await registerTestUser("reader");
    const response = await callRoute(getMe, { cookie: user.cookie });
    expect(response.status).toBe(200);
    expect(response.json.data?.user).not.toHaveProperty("passwordHash");
  });

  it("rejects a refresh token that has already been rotated", async () => {
    const user = await registerTestUser("rotator");
    const firstRefresh = await callRoute(refresh, { method: "POST", cookie: user.cookie });
    expect(firstRefresh.status).toBe(200);
    expect(toCookieHeader(firstRefresh.setCookie)).not.toBe(user.cookie);
    const replay = await callRoute(refresh, { method: "POST", cookie: user.cookie });
    expect(replay.status).toBe(401);
  });

  it("rate limits repeated login attempts", async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 11; attempt += 1) {
      const response = await callRoute(login, {
        method: "POST",
        ip: "192.0.2.77",
        body: { email: "nobody@example.test", password: "wrong" },
      });
      statuses.push(response.status);
    }
    expect(statuses.slice(0, 10).every((status) => status === 401)).toBe(true);
    expect(statuses[10]).toBe(429);
  });
});
