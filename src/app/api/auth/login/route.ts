import { loginSchema } from "@/core/application/schemas/authSchemas";
import { loginUser } from "@/core/application/use-cases/auth/loginUser";
import { setAuthCookies } from "@/infrastructure/auth/authCookies";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";

export const POST = createApiHandler(async (request) => {
  const input = await parseRequestBody(request, loginSchema);
  const session = await loginUser(getDependencies(), input);
  const response = respondWithData({ user: session.user });
  setAuthCookies(response, session);
  return response;
});
