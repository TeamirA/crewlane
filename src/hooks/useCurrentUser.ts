"use client";

import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { UserDto } from "@/types/user";

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: async () => (await apiRequest<{ user: UserDto }>("/api/auth/me")).user,
    staleTime: 5 * 60_000,
  });
}
