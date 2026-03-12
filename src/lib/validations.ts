import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const habitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export const sessionSchema = z.object({
  habitId: z.string().min(1, "Habit is required"),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().int().positive(),
  notes: z.string().max(1000).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type HabitInput = z.infer<typeof habitSchema>;
export type SessionInput = z.infer<typeof sessionSchema>;
