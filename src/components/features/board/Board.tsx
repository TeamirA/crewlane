"use client";

import { getColumnTasks } from "@/lib/boardCache";
import type { BoardDto } from "@/types/board";
import type { ProjectRoleDto } from "@/types/project";

import { AddColumnForm } from "./AddColumnForm";
import { BoardColumn } from "./BoardColumn";

interface BoardProps {
  projectId: string;
  board: BoardDto;
  currentUserRole: ProjectRoleDto;
  onOpenTask: (taskId: string) => void;
}

export function Board({ projectId, board, currentUserRole, onOpenTask }: BoardProps) {
  const canDeleteColumn = currentUserRole !== "MEMBER" && board.columns.length > 1;
  return (
    <div className="flex flex-1 items-start gap-4 overflow-x-auto pb-4">
      {board.columns.map((column, columnIndex) => (
        <BoardColumn
          key={column.id}
          column={column}
          tasks={getColumnTasks(board, column.id)}
          columnIndex={columnIndex}
          columnCount={board.columns.length}
          canDeleteColumn={canDeleteColumn}
          onOpenTask={onOpenTask}
        />
      ))}
      <AddColumnForm projectId={projectId} />
    </div>
  );
}
