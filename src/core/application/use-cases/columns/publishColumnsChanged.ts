import type { AppDependencies } from "../../ports";

export async function publishColumnsChanged(
  { columns, realtime }: Pick<AppDependencies, "columns" | "realtime">,
  projectId: string,
  actorId: string,
): Promise<void> {
  const projectColumns = await columns.listByProject(projectId);
  await realtime.publishToProject(projectId, {
    name: "column.changed",
    actorId,
    payload: { columns: projectColumns },
  });
}
