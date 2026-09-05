import type { ApiErrorResponse, ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/v1";

export async function apiRequest<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
	const response = await fetch(`${API_URL}/${path.replace(/^\//, "")}`, {
		...init,
		credentials: "include",
		headers: { "Content-Type": "application/json", ...init?.headers },
	});

	if (response.status === 401 && retry && path !== "auth/refresh") {
		const refreshed = await fetch(`${API_URL}/auth/refresh`, {
			method: "POST",
			credentials: "include",
		});
		if (refreshed.ok) return apiRequest<T>(path, init, false);
	}

	const payload = (await response.json()) as ApiResponse<T> | ApiErrorResponse;
	if (!response.ok || !payload.success) {
		throw new Error(Array.isArray(payload.message) ? payload.message.join(", ") : payload.message);
	}
	return payload.data;
}
