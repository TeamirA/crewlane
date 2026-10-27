"use client";

import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";

import { TaskCard } from "@/components/features/task/TaskCard";
import { useBoardDragAndDrop } from "@/hooks/useBoardDragAndDrop";
import { getColumnTasks } from "@/lib/boardCache";
import type { BoardDto, TaskDto } from "@/types/board";
import type { ProjectRoleDto } from "@/types/project";

import { AddColumnForm } from "./AddColumnForm";
import { BoardColumn } from "./BoardColumn";

interface BoardProps {
  projectId: string;
  board: BoardDto;
  currentUserRole: ProjectRoleDto;
  isTaskVisible: (task: TaskDto) => boolean;
  onOpenTask: (taskId: string) => void;
}

export function Board(props: BoardProps) {
  const { projectId, board, currentUserRole, isTaskVisible, onOpenTask } = props;
  const { sensors, activeTask, handlers } = useBoardDragAndDrop(projectId, board);
  const canDeleteColumn = currentUserRole !== "MEMBER" && board.columns.length > 1;
  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} {...handlers}>
      <div className="-mx-4 flex flex-1 snap-x snap-mandatory scroll-px-4 items-start gap-4 overflow-x-auto px-4 pb-4 sm:snap-none">
        {board.columns.map((column, columnIndex) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={getColumnTasks(board, column.id).filter(isTaskVisible)}
            columnIndex={columnIndex}
            columnCount={board.columns.length}
            canDeleteColumn={canDeleteColumn}
            onOpenTask={onOpenTask}
          />
        ))}
        <AddColumnForm projectId={projectId} />
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 shadow-lg">
            <TaskCard task={activeTask} onOpen={() => undefined} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
