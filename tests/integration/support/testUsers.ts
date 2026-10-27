import { randomUUID } from "node:crypto";

import { POST as register } from "@/app/api/auth/register/route";

import { callRoute, toCookieHeader } from "./routeClient";

export interface TestUser {
  id: string;
  username: string;
  cookie: string;
}

export async function registerTestUser(prefix: string): Promise<TestUser> {
  const username = `${prefix}_${randomUUID().slice(0, 8)}`;
  const response = await callRoute(register, {
    method: "POST",
    ip: `198.51.100.${Math.floor(Math.random() * 250)}`,
    body: {
      email: `${username}@example.test`,
      username,
      displayName: prefix,
      password: "integration-password",
    },
  });
  const user = response.json.data?.user as { id: string };
  return { id: user.id, username, cookie: toCookieHeader(response.setCookie) };
}
