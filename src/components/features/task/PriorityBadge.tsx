import { Badge } from "@/components/ui/Badge";
import type { TaskPriorityDto } from "@/types/board";

const priorityTones = { LOW: "green", MEDIUM: "amber", HIGH: "red" } as const;

const priorityLabels: Record<TaskPriorityDto, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function PriorityBadge({ priority }: { priority: TaskPriorityDto }) {
  return <Badge tone={priorityTones[priority]}>{priorityLabels[priority]}</Badge>;
}

export const priorityOptions = (Object.keys(priorityLabels) as TaskPriorityDto[]).map(
  (priority) => ({ value: priority, label: priorityLabels[priority] }),
);
