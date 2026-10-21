import { z } from "zod";

const projectNameSchema = z.string().trim().min(1, "Project name is required").max(80);
const projectDescriptionSchema = z.string().trim().max(500).nullable().optional();

export const createProjectSchema = z.object({
  name: projectNameSchema,
  description: projectDescriptionSchema,
});

export const updateProjectSchema = z
  .object({ name: projectNameSchema, description: projectDescriptionSchema })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Provide at least one field to update");

export const assignableRoleSchema = z.enum(["ADMIN", "MEMBER"]);

export const inviteMemberSchema = z.object({
  identifier: z.string().trim().min(1, "Enter an email or username"),
  role: assignableRoleSchema.default("MEMBER"),
});

export const updateMemberRoleSchema = z.object({ role: assignableRoleSchema });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
