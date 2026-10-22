"use client";

import { Modal } from "@/components/ui/Modal";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ProjectDetailsDto } from "@/types/project";

import { InviteMemberForm } from "./InviteMemberForm";
import { MemberRow } from "./MemberRow";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: ProjectDetailsDto;
}

export function MembersModal({ isOpen, onClose, details }: MembersModalProps) {
  const { data: currentUser } = useCurrentUser();
  const canInvite = details.currentUserRole !== "MEMBER";
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Project members">
      <div className="flex flex-col gap-4">
        {canInvite && <InviteMemberForm projectId={details.project.id} />}
        <ul className="divide-y">
          {details.members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              currentUserId={currentUser?.id ?? ""}
              currentUserRole={details.currentUserRole}
            />
          ))}
        </ul>
      </div>
    </Modal>
  );
}
