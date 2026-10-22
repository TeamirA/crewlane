import { z } from "zod";

const columnNameSchema = z.string().trim().min(1, "Column name is required").max(40);

export const createColumnSchema = z.object({ name: columnNameSchema });

export const renameColumnSchema = z.object({ name: columnNameSchema });

export const moveColumnSchema = z.object({ targetIndex: z.number().int().min(0) });

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type RenameColumnInput = z.infer<typeof renameColumnSchema>;
export type MoveColumnInput = z.infer<typeof moveColumnSchema>;
