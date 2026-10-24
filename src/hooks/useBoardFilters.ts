"use client";

import { useState } from "react";

import { EMPTY_TASK_FILTERS, type TaskFilters } from "@/lib/taskFilters";

export function useBoardFilters() {
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_TASK_FILTERS);

  function updateFilter<TKey extends keyof TaskFilters>(key: TKey, value: TaskFilters[TKey]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return { filters, updateFilter, clearFilters: () => setFilters(EMPTY_TASK_FILTERS) };
}
