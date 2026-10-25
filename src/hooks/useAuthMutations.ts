"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { LoginInput, RegisterInput } from "@/core/application/schemas/authSchemas";
import { ROUTES } from "@/lib/constants";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import { clearRealtimeSession } from "@/lib/supabaseBrowserClient";
import type { UserDto } from "@/types/user";

function useSignInSuccessHandler(redirectPath: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return ({ user }: { user: UserDto }) => {
    queryClient.setQueryData(queryKeys.currentUser, user);
    router.replace(redirectPath);
    router.refresh();
  };
}

export function useLogin(redirectPath: string) {
  const onSuccess = useSignInSuccessHandler(redirectPath);
  return useMutation({
    mutationFn: (input: LoginInput) =>
      apiRequest<{ user: UserDto }>("/api/auth/login", { method: "POST", body: input }),
    onSuccess,
  });
}

export function useRegister() {
  const onSuccess = useSignInSuccessHandler(ROUTES.projects);
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      apiRequest<{ user: UserDto }>("/api/auth/register", { method: "POST", body: input }),
    onSuccess,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => apiRequest("/api/auth/logout", { method: "POST" }),
    onSettled: () => {
      clearRealtimeSession();
      queryClient.clear();
      router.replace(ROUTES.login);
    },
  });
}
