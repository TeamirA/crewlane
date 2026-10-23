import { AvatarStack } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { TaskDto } from "@/types/board";

import { DueDateLabel } from "./DueDateLabel";
import { PriorityBadge } from "./PriorityBadge";

interface TaskCardProps {
  task: TaskDto;
  onOpen: (taskId: string) => void;
}

export function TaskCard({ task, onOpen }: TaskCardProps) {
  return (
    <article className="relative rounded-lg border bg-white p-3 shadow-xs hover:border-indigo-300">
      {task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <Badge key={label.id} color={label.color}>
              {label.name}
            </Badge>
          ))}
        </div>
      )}
      <h3 className="text-sm font-medium">
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className="text-left after:absolute after:inset-0 hover:text-indigo-700"
        >
          {task.title}
        </button>
      </h3>
      <div className="mt-3 flex items-center gap-2">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && <DueDateLabel dueDate={task.dueDate} />}
        {task.commentCount > 0 && (
          <span className="text-xs text-neutral-500">
            {task.commentCount} <span className="sr-only">comments</span>
            <span aria-hidden="true">💬</span>
          </span>
        )}
        <span className="ml-auto">
          <AvatarStack people={task.assignees} maxVisible={3} />
        </span>
      </div>
    </article>
  );
}
