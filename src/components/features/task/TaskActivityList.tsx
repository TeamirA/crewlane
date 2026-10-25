"use client";

import { Spinner } from "@/components/ui/Spinner";
import { useTaskActivity } from "@/hooks/useTaskActivity";
import { describeActivity } from "@/lib/describeActivity";
import { formatRelativeTime } from "@/lib/formatting";
import type { TaskDto } from "@/types/board";

export function TaskActivityList({ task }: { task: TaskDto }) {
  const { data: activity, isPending, error } = useTaskActivity(task.id, task.updatedAt);
  if (isPending) return <Spinner size="sm" label="Loading activity" />;
  if (error) {
    return <p className="text-sm text-red-600">Could not load activity: {error.message}</p>;
  }
  if (activity.length === 0) return <p className="text-sm text-neutral-500">No activity yet.</p>;
  return (
    <ol className="flex flex-col gap-2 border-l pl-4">
      {activity.map((entry) => (
        <li key={entry.id} className="text-sm text-neutral-600">
          <span className="font-medium text-neutral-800">{entry.actor.displayName}</span>{" "}
          {describeActivity(entry)}{" "}
          <time dateTime={entry.createdAt} className="text-xs text-neutral-400">
            {formatRelativeTime(entry.createdAt)}
          </time>
        </li>
      ))}
    </ol>
  );
}
