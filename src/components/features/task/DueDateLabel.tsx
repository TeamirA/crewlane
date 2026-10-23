import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/formatting";

export function isDueDateOverdue(dueDate: string, now: Date = new Date()): boolean {
  const endOfDueDay = new Date(dueDate);
  endOfDueDay.setUTCHours(23, 59, 59, 999);
  return endOfDueDay < now;
}

export function DueDateLabel({ dueDate }: { dueDate: string }) {
  const isOverdue = isDueDateOverdue(dueDate);
  return (
    <span className={cn("text-xs", isOverdue ? "font-medium text-red-600" : "text-neutral-500")}>
      <span className="sr-only">{isOverdue ? "Overdue, due " : "Due "}</span>
      {formatShortDate(dueDate)}
    </span>
  );
}
