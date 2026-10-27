"use client";

import { useState } from "react";

import { MembersModal } from "@/components/features/member/MembersModal";
import { AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { ProjectDetailsDto } from "@/types/project";

import { ProjectActionsMenu } from "./ProjectActionsMenu";

export function ProjectHeader({ details }: { details: ProjectDetailsDto }) {
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const { project, members, currentUserRole } = details;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="min-w-0 basis-full sm:flex-1 sm:basis-auto">
        <h1 className="truncate text-xl font-semibold">{project.name}</h1>
        {project.description && (
          <p className="truncate text-sm text-neutral-500">{project.description}</p>
        )}
      </div>
      <AvatarStack people={members.map((member) => member.user)} />
      <Button variant="secondary" size="sm" onClick={() => setIsMembersOpen(true)}>
        {currentUserRole === "MEMBER" ? "Members" : "Share"}
      </Button>
      {currentUserRole === "OWNER" && <ProjectActionsMenu project={project} />}
      <MembersModal
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        details={details}
      />
    </div>
  );
}
