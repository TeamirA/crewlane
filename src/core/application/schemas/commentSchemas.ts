import { z } from "zod";

export const commentBodySchema = z.object({
  body: z.string().trim().min(1, "Comment cannot be empty").max(5000),
});

export type CommentBodyInput = z.infer<typeof commentBodySchema>;
