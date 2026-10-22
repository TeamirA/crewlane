"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

import { CreateProjectForm } from "./CreateProjectForm";

export function ProjectsHeader() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Your projects</h1>
        <p className="text-sm text-neutral-500">Workspaces you own or have been invited to.</p>
      </div>
      <Button onClick={() => setIsCreateOpen(true)}>New project</Button>
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create a project"
        description="New projects start with To Do, In Progress, and Done columns."
      >
        <CreateProjectForm onCreated={() => setIsCreateOpen(false)} />
      </Modal>
    </div>
  );
}
