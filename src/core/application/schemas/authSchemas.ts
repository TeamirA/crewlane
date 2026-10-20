import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email address");

export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters");

export const registerSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  displayName: z.string().trim().min(1, "Display name is required").max(60),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
