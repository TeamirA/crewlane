"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { inviteMemberSchema } from "@/core/application/schemas/projectSchemas";
import { useFormFields } from "@/hooks/useFormFields";
import { useInviteMember } from "@/hooks/useMemberMutations";

const roleOptions = [
  { value: "MEMBER", label: "Member" },
  { value: "ADMIN", label: "Admin" },
];

export function InviteMemberForm({ projectId }: { projectId: string }) {
  const inviteMember = useInviteMember(projectId);
  const { values, setValues, fieldErrors, handleChange, validate } = useFormFields(
    inviteMemberSchema,
    { identifier: "", role: "MEMBER" },
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = validate();
    if (!input) return;
    inviteMember.mutate(input, { onSuccess: () => setValues({ identifier: "", role: "MEMBER" }) });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <Input
          label="Email or username"
          name="identifier"
          placeholder="teammate@company.com or username"
          value={values.identifier}
          onChange={handleChange}
          error={fieldErrors.identifier}
          containerClassName="flex-1"
          isLabelHidden
        />
        <Select
          label="Role"
          isLabelHidden
          options={roleOptions}
          value={values.role}
          onChange={(event) => setValues({ ...values, role: event.target.value as "MEMBER" })}
          containerClassName="sm:w-32"
        />
        <Button type="submit" isLoading={inviteMember.isPending}>
          Invite
        </Button>
      </div>
      {inviteMember.error && (
        <p role="alert" className="text-sm text-red-600">
          {inviteMember.error.message}
        </p>
      )}
      {inviteMember.isSuccess && <p className="text-sm text-emerald-700">Member added.</p>}
    </form>
  );
}
