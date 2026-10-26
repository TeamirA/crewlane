"use client";

import { useMutation } from "@tanstack/react-query";

import type { CreateTaskInput, UpdateTaskInput } from "@/core/application/schemas/taskSchemas";
import { moveTaskInBoard, removeTask, upsertTask } from "@/lib/boardCache";
import { apiRequest } from "@/lib/httpClient";
import type { BoardDto, TaskDto } from "@/types/board";

import { useBoardCacheUpdater } from "./useBoard";
import { useOptimisticBoard } from "./useOptimisticBoard";

type TaskResponse = { task: TaskDto };

type CreateTaskRequest = Omit<CreateTaskInput, "priority" | "assigneeIds" | "labelIds"> &
  Partial<Pick<CreateTaskInput, "priority" | "assigneeIds" | "labelIds">>;

export function useCreateTask(projectId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  return useMutation({
    mutationFn: (input: CreateTaskRequest) =>
      apiRequest<TaskResponse>(`/api/projects/${projectId}/tasks`, { method: "POST", body: input }),
    onSuccess: ({ task }) => updateBoard((board) => upsertTask(board, task)),
  });
}

function patchTaskFields(board: BoardDto, taskId: string, input: UpdateTaskInput): BoardDto {
  const { title, description, priority, dueDate } = input;
  const fields = Object.fromEntries(
    Object.entries({
      title,
      description,
      priority,
      dueDate: dueDate?.toISOString() ?? dueDate,
    }).filter(([, value]) => value !== undefined),
  );
  const task = board.tasks.find((candidate) => candidate.id === taskId);
  return task ? upsertTask(board, { ...task, ...fields }) : board;
}

export function useUpdateTask(projectId: string, taskId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  const { applyOptimisticUpdate, rollback } = useOptimisticBoard(projectId);
  return useMutation({
    mutationFn: (input: UpdateTaskInput) =>
      apiRequest<TaskResponse>(`/api/tasks/${taskId}`, { method: "PATCH", body: input }),
    onMutate: (input) => applyOptimisticUpdate((board) => patchTaskFields(board, taskId, input)),
    onSuccess: ({ task }) => updateBoard((board) => upsertTask(board, task)),
    onError: (_error, _input, snapshot) => rollback(snapshot),
  });
}

interface MoveTaskVariables {
  taskId: string;
  columnId: string;
  targetIndex: number;
}

export function useMoveTask(projectId: string) {
  const updateBoard = useBoardCacheUpdater(projectId);
  const { applyOptimisticUpdate, rollback } = useOptimisticBoard(projectId);
  return useMutation({
    mutationFn: ({ taskId, ...input }: MoveTaskVariables) =>
      apiRequest<TaskResponse>(`/api/tasks/${taskId}/move`, { method: "PATCH", body: input }),
    onMutate: ({ taskId, columnId, targetIndex }) =>
      applyOptimisticUpdate((board) => moveTaskInBoard(board, taskId, columnId, targetIndex)),
    onSuccess: ({ task }) => updateBoard((board) => upsertTask(board, task)),
    onError: (_error, _variables, snapshot) => rollback(snapshot),
  });
}

export function useDeleteTask(projectId: string) {
  const { applyOptimisticUpdate, rollback } = useOptimisticBoard(projectId);
  return useMutation({
    mutationFn: (taskId: string) => apiRequest(`/api/tasks/${taskId}`, { method: "DELETE" }),
    onMutate: (taskId) => applyOptimisticUpdate((board) => removeTask(board, taskId)),
    onError: (_error, _taskId, snapshot) => rollback(snapshot),
  });
}
