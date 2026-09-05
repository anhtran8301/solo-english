import { expect, test } from "bun:test";
import { loginSchema, signupSchema } from "./schema";

test("auth schemas reject invalid input", () => {
	expect(loginSchema.safeParse({ email: "bad", password: "" }).success).toBe(false);
	expect(
		signupSchema.safeParse({ name: "", email: "a@example.com", password: "short" }).success,
	).toBe(false);
});
