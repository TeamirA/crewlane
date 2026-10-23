import { TaskCard } from "@/components/features/task/TaskCard";
import type { ColumnDto, TaskDto } from "@/types/board";

import { AddTaskForm } from "./AddTaskForm";
import { ColumnHeader } from "./ColumnHeader";

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
      <ul className="flex min-h-12 flex-col gap-2 overflow-y-auto">
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskCard task={task} onOpen={onOpenTask} />
          </li>
        ))}
      </ul>
      <AddTaskForm projectId={column.projectId} columnId={column.id} />
    </section>
  );
}
