import { AUTH_RATE_LIMITS } from "@/core/application/services/enforceRateLimit";
import { registerSchema } from "@/core/application/schemas/authSchemas";
import { registerUser } from "@/core/application/use-cases/auth/registerUser";
import { setAuthCookies } from "@/infrastructure/auth/authCookies";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { rateLimitRequest } from "@/lib/api/rateLimitRequest";

export const POST = createApiHandler(async (request) => {
  await rateLimitRequest(request, AUTH_RATE_LIMITS.register);
  const input = await parseRequestBody(request, registerSchema);
  const session = await registerUser(getDependencies(), input);
  const response = respondWithData({ user: session.user }, 201);
  setAuthCookies(response, session);
  return response;
});
