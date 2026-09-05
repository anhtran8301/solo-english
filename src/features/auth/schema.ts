import { z } from "zod";

export const loginSchema = z.object({
	email: z.email("Enter a valid email"),
	password: z.string().min(1, "Password is required"),
});

export const signupSchema = loginSchema.extend({
	name: z.string().trim().min(1, "Name is required"),
	password: z.string().min(8, "Password must contain at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
