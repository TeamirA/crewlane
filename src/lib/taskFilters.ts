import type { TaskDto, TaskPriorityDto } from "@/types/board";

export const ANY_FILTER_VALUE = "ANY";

export interface TaskFilters {
  searchText: string;
  assigneeId: string;
  labelId: string;
  priority: TaskPriorityDto | typeof ANY_FILTER_VALUE;
}

export const EMPTY_TASK_FILTERS: TaskFilters = {
  searchText: "",
  assigneeId: ANY_FILTER_VALUE,
  labelId: ANY_FILTER_VALUE,
  priority: ANY_FILTER_VALUE,
};

export function hasActiveFilters(filters: TaskFilters): boolean {
  return (Object.keys(filters) as (keyof TaskFilters)[]).some(
    (key) => filters[key] !== EMPTY_TASK_FILTERS[key],
  );
}

function matchesSearchText(task: TaskDto, searchText: string): boolean {
  const normalizedSearch = searchText.trim().toLowerCase();
  if (!normalizedSearch) return true;
  return `${task.title} ${task.description ?? ""}`.toLowerCase().includes(normalizedSearch);
}

export function doesTaskMatchFilters(task: TaskDto, filters: TaskFilters): boolean {
  const matchesAssignee =
    filters.assigneeId === ANY_FILTER_VALUE ||
    task.assignees.some((assignee) => assignee.id === filters.assigneeId);
  const matchesLabel =
    filters.labelId === ANY_FILTER_VALUE ||
    task.labels.some((label) => label.id === filters.labelId);
  const matchesPriority =
    filters.priority === ANY_FILTER_VALUE || task.priority === filters.priority;
  return (
    matchesAssignee &&
    matchesLabel &&
    matchesPriority &&
    matchesSearchText(task, filters.searchText)
  );
}
