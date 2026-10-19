import type { Label } from "../entities/label";

export interface LabelRepository {
  listByProject(projectId: string): Promise<Label[]>;
  countInProject(projectId: string, labelIds: string[]): Promise<number>;
  create(projectId: string, name: string, color: string): Promise<Label>;
  delete(labelId: string): Promise<void>;
  findById(labelId: string): Promise<Label | null>;
}
