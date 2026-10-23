import type { Column } from "../../domain/entities/column";
import type { Label } from "../../domain/entities/label";
import type { Task } from "../../domain/entities/task";

export interface ProjectBoard {
  columns: Column[];
  tasks: Task[];
  labels: Label[];
}
