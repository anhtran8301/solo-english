import { apiRequest } from "@/lib/api-client";
import type { User } from "@/types/auth";
import type { LoginInput, SignupInput } from "./schema";

export const authApi = {
	me: () => apiRequest<User>("auth/me"),
	login: (input: LoginInput) =>
		apiRequest<User>("auth/login", { method: "POST", body: JSON.stringify(input) }),
	signup: (input: SignupInput) =>
		apiRequest<User>("auth/signup", { method: "POST", body: JSON.stringify(input) }),
	logout: () => apiRequest<null>("auth/logout", { method: "POST" }, false),
	refresh: () => apiRequest<User>("auth/refresh", { method: "POST" }, false),
};
