import { getProjectBoardWithTasks } from "@/core/application/use-cases/board/getProjectBoardWithTasks";
import { getDependencies } from "@/infrastructure/container";
import { createApiHandler, respondWithData } from "@/lib/api/apiHandler";
import { requireUserId } from "@/lib/api/requireUserId";

type Params = { projectId: string };

export const GET = createApiHandler<Params>(async (request, { params }) => {
  const userId = await requireUserId(request);
  const { projectId } = await params;
  return respondWithData(await getProjectBoardWithTasks(getDependencies(), userId, projectId));
});
