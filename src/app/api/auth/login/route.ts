import { AUTH_RATE_LIMITS } from "@/core/application/services/enforceRateLimit";
import { loginSchema } from "@/core/application/schemas/authSchemas";
import { loginUser } from "@/core/application/use-cases/auth/loginUser";
import { setAuthCookies } from "@/infrastructure/auth/authCookies";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { rateLimitRequest } from "@/lib/api/rateLimitRequest";

export const POST = createApiHandler(async (request) => {
  await rateLimitRequest(request, AUTH_RATE_LIMITS.login);
  const input = await parseRequestBody(request, loginSchema);
  const session = await loginUser(getDependencies(), input);
  const response = respondWithData({ user: session.user });
  setAuthCookies(response, session);
  return response;
});
