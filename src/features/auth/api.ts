import { createAuthClient } from "better-auth/react";
import { API_URL, ApiError, apiRequest } from "@/lib/api-client";
import type { User } from "@/types/auth";
import type { LoginInput, SignupInput } from "./schema";
export const authClient = createAuthClient({
	baseURL: API_URL.replace(/\/v1\/?$/, ""),
	basePath: "/api/auth",
});
export const authApi = {
	me: async () => {
		try {
			return await apiRequest<User>("auth/me");
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) return null;
			throw e;
		}
	},
	login: async (input: LoginInput) => {
		const result = await authClient.signIn.email(input);
		if (result.error) throw new Error("Email hoặc mật khẩu không đúng. Hãy kiểm tra lại.");
		return authApi.me();
	},
	signup: async (input: SignupInput) => {
		const result = await authClient.signUp.email(input);
		if (result.error)
			throw new Error(
				result.error.code === "USER_ALREADY_EXISTS"
					? "Email này đã được đăng ký."
					: "Không tạo được tài khoản. Hãy kiểm tra thông tin.",
			);
		return authApi.me();
	},
	logout: async () => {
		const result = await authClient.signOut();
		if (result.error) throw new Error("Chưa đăng xuất được. Hãy thử lại.");
	},
};
