import type { Column } from "../entities/column";

export interface ColumnRepository {
  listByProject(projectId: string): Promise<Column[]>;
  findById(columnId: string): Promise<Column | null>;
  create(projectId: string, name: string, position: number): Promise<Column>;
  rename(columnId: string, name: string): Promise<Column>;
  updatePosition(columnId: string, position: number): Promise<Column>;
  rebalancePositions(projectId: string, orderedColumnIds: string[]): Promise<void>;
  delete(columnId: string): Promise<void>;
}
