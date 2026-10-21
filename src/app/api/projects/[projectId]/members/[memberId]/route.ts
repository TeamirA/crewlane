import { updateMemberRoleSchema } from "@/core/application/schemas/projectSchemas";
import { removeProjectMember } from "@/core/application/use-cases/members/removeProjectMember";
import { updateMemberRole } from "@/core/application/use-cases/members/updateMemberRole";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string; memberId: string };

export const PATCH = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId, memberId } = await params;
  const input = await parseRequestBody(request, updateMemberRoleSchema);
  const member = await updateMemberRole(getDependencies(), userId, projectId, memberId, input);
  return respondWithData({ member });
});

export const DELETE = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId, memberId } = await params;
  await removeProjectMember(getDependencies(), userId, projectId, memberId);
  return respondWithData({ isRemoved: true });
});
