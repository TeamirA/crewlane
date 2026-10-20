import { logoutUser } from "@/core/application/use-cases/auth/logoutUser";
import { clearAuthCookies, REFRESH_TOKEN_COOKIE } from "@/infrastructure/auth/authCookies";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";

export const POST = createApiHandler(async (request) => {
  await logoutUser(getDependencies(), request.cookies.get(REFRESH_TOKEN_COOKIE)?.value);
  const response = respondWithData({ isLoggedOut: true });
  clearAuthCookies(response);
  return response;
});
