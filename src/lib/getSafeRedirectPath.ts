import { ROUTES } from "./constants";

// Only allow same-origin relative paths to prevent open redirects.
export function getSafeRedirectPath(candidate: string | null | undefined): string {
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return ROUTES.projects;
  }
  return candidate;
}
