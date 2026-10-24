"use client";

import { priorityOptions } from "@/components/features/task/PriorityBadge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ANY_FILTER_VALUE, hasActiveFilters, type TaskFilters } from "@/lib/taskFilters";
import type { LabelDto } from "@/types/board";
import type { UserSummaryDto } from "@/types/user";

interface BoardToolbarProps {
  filters: TaskFilters;
  members: UserSummaryDto[];
  labels: LabelDto[];
  onFilterChange: <TKey extends keyof TaskFilters>(key: TKey, value: TaskFilters[TKey]) => void;
  onClear: () => void;
}

const anyOption = (label: string) => ({ value: ANY_FILTER_VALUE, label });

export function BoardToolbar({
  filters,
  members,
  labels,
  onFilterChange,
  onClear,
}: BoardToolbarProps) {
  const assigneeOptions = [
    anyOption("All assignees"),
    ...members.map((member) => ({ value: member.id, label: member.displayName })),
  ];
  const labelOptions = [
    anyOption("All labels"),
    ...labels.map((label) => ({ value: label.id, label: label.name })),
  ];
  return (
    <div role="search" className="flex flex-wrap items-center gap-2">
      <Input
        label="Search tasks"
        isLabelHidden
        type="search"
        placeholder="Search tasks…"
        value={filters.searchText}
        onChange={(event) => onFilterChange("searchText", event.target.value)}
        containerClassName="w-full sm:w-64"
      />
      <Select
        label="Filter by assignee"
        isLabelHidden
        options={assigneeOptions}
        value={filters.assigneeId}
        onChange={(event) => onFilterChange("assigneeId", event.target.value)}
        containerClassName="w-[calc(50%-0.25rem)] sm:w-44"
      />
      <Select
        label="Filter by label"
        isLabelHidden
        options={labelOptions}
        value={filters.labelId}
        onChange={(event) => onFilterChange("labelId", event.target.value)}
        containerClassName="w-[calc(50%-0.25rem)] sm:w-36"
      />
      <Select
        label="Filter by priority"
        isLabelHidden
        options={[anyOption("All priorities"), ...priorityOptions]}
        value={filters.priority}
        onChange={(event) =>
          onFilterChange("priority", event.target.value as TaskFilters["priority"])
        }
        containerClassName="w-[calc(50%-0.25rem)] sm:w-36"
      />
      {hasActiveFilters(filters) && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
