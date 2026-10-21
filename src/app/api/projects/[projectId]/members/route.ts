import { inviteMemberSchema } from "@/core/application/schemas/projectSchemas";
import { inviteProjectMember } from "@/core/application/use-cases/members/inviteProjectMember";
import { listProjectMembers } from "@/core/application/use-cases/members/listProjectMembers";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, parseRequestBody, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const members = await listProjectMembers(getDependencies(), userId, projectId);
  return respondWithData({ members });
});

export const POST = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  const input = await parseRequestBody(request, inviteMemberSchema);
  const member = await inviteProjectMember(getDependencies(), userId, projectId, input);
  return respondWithData({ member }, 201);
});
