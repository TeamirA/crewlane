import { z } from "zod";

import { TASK_PRIORITIES } from "../../domain/entities/task";

const taskTitleSchema = z.string().trim().min(1, "Title is required").max(200);
const taskDescriptionSchema = z.string().trim().max(5000).nullable();
const dueDateSchema = z.union([z.null(), z.coerce.date()]);
const idListSchema = z.array(z.uuid()).max(20);

export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const createTaskSchema = z.object({
  columnId: z.uuid(),
  title: taskTitleSchema,
  description: taskDescriptionSchema.optional(),
  priority: taskPrioritySchema.default("MEDIUM"),
  dueDate: dueDateSchema.optional(),
  assigneeIds: idListSchema.default([]),
  labelIds: idListSchema.default([]),
});

export const updateTaskSchema = z
  .object({
    title: taskTitleSchema,
    description: taskDescriptionSchema,
    priority: taskPrioritySchema,
    dueDate: dueDateSchema,
    assigneeIds: idListSchema,
    labelIds: idListSchema,
  })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update");

export const moveTaskSchema = z.object({
  columnId: z.uuid(),
  targetIndex: z.number().int().min(0),
});

export const assignTaskMembersSchema = z.object({ assigneeIds: idListSchema });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type AssignTaskMembersInput = z.infer<typeof assignTaskMembersSchema>;
