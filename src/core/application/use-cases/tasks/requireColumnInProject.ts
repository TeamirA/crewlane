import type { Column } from "../../../domain/entities/column";
import { ValidationError } from "../../../domain/errors/domainErrors";
import type { AppDependencies } from "../../ports";

export async function requireColumnInProject(
  { columns }: Pick<AppDependencies, "columns">,
  columnId: string,
  projectId: string,
): Promise<Column> {
  const column = await columns.findById(columnId);
  if (!column || column.projectId !== projectId) {
    throw new ValidationError("Column does not belong to this project");
  }
  return column;
}
