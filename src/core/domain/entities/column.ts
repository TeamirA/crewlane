export const DEFAULT_COLUMN_NAMES = ["To Do", "In Progress", "Done"] as const;

export interface Column {
  id: string;
  projectId: string;
  name: string;
  position: number;
}
