"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  InviteMemberInput,
  UpdateMemberRoleInput,
} from "@/core/application/schemas/projectSchemas";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";

function useInvalidateProject(projectId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
}

export function useInviteMember(projectId: string) {
  const onSuccess = useInvalidateProject(projectId);
  return useMutation({
    mutationFn: (input: InviteMemberInput) =>
      apiRequest(`/api/projects/${projectId}/members`, { method: "POST", body: input }),
    onSuccess,
  });
}

export function useUpdateMemberRole(projectId: string) {
  const onSuccess = useInvalidateProject(projectId);
  return useMutation({
    mutationFn: ({ memberId, role }: UpdateMemberRoleInput & { memberId: string }) =>
      apiRequest(`/api/projects/${projectId}/members/${memberId}`, {
        method: "PATCH",
        body: { role },
      }),
    onSuccess,
  });
}

export function useRemoveMember(projectId: string) {
  const onSuccess = useInvalidateProject(projectId);
  return useMutation({
    mutationFn: (memberId: string) =>
      apiRequest(`/api/projects/${projectId}/members/${memberId}`, { method: "DELETE" }),
    onSuccess,
  });
}
