"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PointerEventHandler } from "react";

import { TaskCard } from "@/components/features/task/TaskCard";
import { cn } from "@/lib/cn";
import type { TaskDto } from "@/types/board";

interface SortableTaskCardProps {
  task: TaskDto;
  onOpen: (taskId: string) => void;
}

// The whole card can be dragged with a pointer; keyboard dragging uses the dedicated handle so
// pressing Space or Enter on the title still opens the task.
export function SortableTaskCard({ task, onOpen }: SortableTaskCardProps) {
  const sortable = useSortable({ id: task.id });
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition } =
    sortable;
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      onPointerDown={listeners?.onPointerDown as PointerEventHandler<HTMLLIElement> | undefined}
      className={cn("touch-manipulation rounded-lg", sortable.isDragging && "opacity-40")}
    >
      <TaskCard
        task={task}
        onOpen={onOpen}
        dragHandle={
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-roledescription="drag handle"
            aria-label={`Move task ${task.title}`}
            className="relative z-10 -m-1 cursor-grab rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <span aria-hidden="true" className="block text-xs leading-none tracking-tighter">
              ⋮⋮
            </span>
          </button>
        }
      />
    </li>
  );
}
