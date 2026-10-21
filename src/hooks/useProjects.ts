"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { CreateProjectInput } from "@/core/application/schemas/projectSchemas";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { ProjectDto, ProjectSummaryDto } from "@/types/project";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: async () =>
      (await apiRequest<{ projects: ProjectSummaryDto[] }>("/api/projects")).projects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) =>
      (await apiRequest<{ project: ProjectDto }>("/api/projects", { method: "POST", body: input }))
        .project,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects }),
  });
}
