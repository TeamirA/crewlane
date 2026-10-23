"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { cn } from "@/lib/cn";
import { toColumnDropId } from "@/lib/dragTargets";
import type { ColumnDto, TaskDto } from "@/types/board";

import { AddTaskForm } from "./AddTaskForm";
import { ColumnHeader } from "./ColumnHeader";
import { SortableTaskCard } from "./SortableTaskCard";

interface BoardColumnProps {
  column: ColumnDto;
  tasks: TaskDto[];
  columnIndex: number;
  columnCount: number;
  canDeleteColumn: boolean;
  onOpenTask: (taskId: string) => void;
}

export function BoardColumn(props: BoardColumnProps) {
  const { column, tasks, columnIndex, columnCount, canDeleteColumn, onOpenTask } = props;
  const { setNodeRef, isOver } = useDroppable({ id: toColumnDropId(column.id) });
  return (
    <section
      aria-label={`${column.name} column`}
      className="flex max-h-full w-72 shrink-0 flex-col gap-3 rounded-xl bg-neutral-100 p-3"
    >
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        columnIndex={columnIndex}
        columnCount={columnCount}
        canDelete={canDeleteColumn}
      />
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className={cn(
            "flex min-h-16 flex-col gap-2 overflow-y-auto rounded-lg p-0.5",
            isOver && "bg-indigo-50",
          )}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onOpen={onOpenTask} />
          ))}
        </ul>
      </SortableContext>
      <AddTaskForm projectId={column.projectId} columnId={column.id} />
    </section>
  );
}
