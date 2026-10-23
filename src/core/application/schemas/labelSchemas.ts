import { z } from "zod";

export const createLabelSchema = z.object({
  name: z.string().trim().min(1, "Label name is required").max(30),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color such as #6366f1"),
});

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
