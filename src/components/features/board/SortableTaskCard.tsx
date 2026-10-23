"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TaskCard } from "@/components/features/task/TaskCard";
import { cn } from "@/lib/cn";
import type { TaskDto } from "@/types/board";

interface SortableTaskCardProps {
  task: TaskDto;
  onOpen: (taskId: string) => void;
}

export function SortableTaskCard({ task, onOpen }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn("touch-manipulation rounded-lg", isDragging && "opacity-40")}
      {...attributes}
      {...listeners}
      aria-roledescription="draggable task"
    >
      <TaskCard task={task} onOpen={onOpen} />
    </li>
  );
}
