"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useDeleteColumn, useMoveColumn } from "@/hooks/useColumnMutations";
import type { ColumnDto } from "@/types/board";

interface ColumnMenuProps {
  column: ColumnDto;
  columnIndex: number;
  columnCount: number;
  canDelete: boolean;
  onRename: () => void;
}

export function ColumnMenu(props: ColumnMenuProps) {
  const { column, columnIndex, columnCount, canDelete, onRename } = props;
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const moveColumn = useMoveColumn(column.projectId);
  const deleteColumn = useDeleteColumn(column.projectId);
  const moveTo = (targetIndex: number) => moveColumn.mutate({ columnId: column.id, targetIndex });
  return (
    <>
      <Dropdown
        triggerLabel={`Actions for column ${column.name}`}
        triggerContent={
          <span aria-hidden="true" className="px-1 text-neutral-500">
            •••
          </span>
        }
      >
        {(closeMenu) => (
          <>
            <DropdownItem onSelect={() => (closeMenu(), onRename())}>Rename</DropdownItem>
            {columnIndex > 0 && (
              <DropdownItem onSelect={() => (closeMenu(), moveTo(columnIndex - 1))}>
                Move left
              </DropdownItem>
            )}
            {columnIndex < columnCount - 1 && (
              <DropdownItem onSelect={() => (closeMenu(), moveTo(columnIndex + 1))}>
                Move right
              </DropdownItem>
            )}
            {canDelete && (
              <DropdownItem isDestructive onSelect={() => (closeMenu(), setIsDeleteOpen(true))}>
                Delete column
              </DropdownItem>
            )}
          </>
        )}
      </Dropdown>
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title={`Delete "${column.name}"?`}
        confirmLabel="Delete column"
        isConfirming={deleteColumn.isPending}
        errorMessage={deleteColumn.error?.message}
        onConfirm={() =>
          deleteColumn.mutate(column.id, { onSuccess: () => setIsDeleteOpen(false) })
        }
        onCancel={() => setIsDeleteOpen(false)}
      >
        All tasks in this column will be deleted as well.
      </ConfirmDialog>
    </>
  );
}
