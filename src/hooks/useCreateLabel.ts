"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateLabelInput } from "@/core/application/schemas/labelSchemas";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { LabelDto } from "@/types/board";

export function useCreateLabel(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLabelInput) =>
      (
        await apiRequest<{ label: LabelDto }>(`/api/projects/${projectId}/labels`, {
          method: "POST",
          body: input,
        })
      ).label,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.board(projectId) }),
  });
}
