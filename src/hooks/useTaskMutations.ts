"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { CreateTaskInput, UpdateTaskInput } from "@/core/application/schemas/taskSchemas";
import { moveTaskInBoard, removeTask, upsertTask } from "@/lib/boardCache";
import { apiRequest } from "@/lib/httpClient";
import { queryKeys } from "@/lib/queryKeys";
import type { TaskDto } from "@/types/board";

import { useBoardCacheUpdater } from "./useBoard";

type TaskResponse = { task: TaskDto };

type CreateTaskRequest = Omit<CreateTaskInput, "priority" | "assigneeIds" | "labelIds"> &
  Partial<Pick<CreateTaskInput, "priority" | "assigneeIds" | "labelIds">>;

function useRefetchBoardOnError(projectId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.board(projectId) });
}

export function useCreateTask(projectId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: (input: CreateTaskRequest) =>
      apiRequest<TaskResponse>(`/api/projects/${projectId}/tasks`, { method: "POST", body: input }),
    onSuccess: ({ task }) => updateBoard((board) => upsertTask(board, task)),
  });
}

export function useUpdateTask(projectId: string, taskId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: (input: UpdateTaskInput) =>
      apiRequest<TaskResponse>(`/api/tasks/${taskId}`, { method: "PATCH", body: input }),
    onSuccess: ({ task }) => updateBoard((board) => upsertTask(board, task)),
    onError: useRefetchBoardOnError(projectId),
  });
}

interface MoveTaskVariables {
  taskId: string;
  columnId: string;
  targetIndex: number;
}

export function useMoveTask(projectId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: ({ taskId, ...input }: MoveTaskVariables) =>
      apiRequest<TaskResponse>(`/api/tasks/${taskId}/move`, { method: "PATCH", body: input }),
    onMutate: ({ taskId, columnId, targetIndex }) =>
      updateBoard((board) => moveTaskInBoard(board, taskId, columnId, targetIndex)),
    onSuccess: ({ task }) => updateBoard((board) => upsertTask(board, task)),
    onError: useRefetchBoardOnError(projectId),
  });
}

export function useDeleteTask(projectId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: (taskId: string) => apiRequest(`/api/tasks/${taskId}`, { method: "DELETE" }),
    onMutate: (taskId) => updateBoard((board) => removeTask(board, taskId)),
    onError: useRefetchBoardOnError(projectId),
  });
}
