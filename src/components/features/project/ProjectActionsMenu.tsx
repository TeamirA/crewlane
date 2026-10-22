"use client";

import { useState } from "react";

import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Modal } from "@/components/ui/Modal";
import type { ProjectDto } from "@/types/project";

import { DeleteProjectConfirmation } from "./DeleteProjectConfirmation";
import { RenameProjectForm } from "./RenameProjectForm";

type OpenDialog = "rename" | "delete" | null;

export function ProjectActionsMenu({ project }: { project: ProjectDto }) {
  const [openDialog, setOpenDialog] = useState<OpenDialog>(null);
  const closeDialog = () => setOpenDialog(null);
  return (
    <>
      <Dropdown
        triggerLabel="Project settings"
        triggerContent={
          <span aria-hidden="true" className="px-1 text-lg leading-none text-neutral-600">
            •••
          </span>
        }
      >
        {(closeMenu) => (
          <>
            <DropdownItem onSelect={() => (closeMenu(), setOpenDialog("rename"))}>
              Rename project
            </DropdownItem>
            <DropdownItem isDestructive onSelect={() => (closeMenu(), setOpenDialog("delete"))}>
              Delete project
            </DropdownItem>
          </>
        )}
      </Dropdown>
      <Modal isOpen={openDialog === "rename"} onClose={closeDialog} title="Edit project">
        <RenameProjectForm project={project} onDone={closeDialog} />
      </Modal>
      <Modal isOpen={openDialog === "delete"} onClose={closeDialog} title="Delete project?">
        <DeleteProjectConfirmation project={project} onCancel={closeDialog} />
      </Modal>
    </>
  );
}
