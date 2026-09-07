import type { ApiErrorResponse, ApiResponse } from "@/types/api";
export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/v1";
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
	) {
		super(message);
	}
}
export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${API_URL}/${path.replace(/^\//, "")}`, {
		...init,
		credentials: "include",
		headers: { "Content-Type": "application/json", ...init?.headers },
	}).catch((error: unknown) => {
		if (error instanceof Error && error.name === "AbortError") throw error;
		throw new ApiError(
			"Mất kết nối với máy chủ. Dữ liệu nhập vẫn được giữ; hãy thử lại khi có mạng.",
			0,
		);
	});
	const payload = (await response.json().catch(() => null)) as
		| ApiResponse<T>
		| ApiErrorResponse
		| null;
	if (!response.ok || !payload?.success)
		throw new ApiError(
			payload
				? Array.isArray(payload.message)
					? payload.message.join("\n")
					: payload.message
				: "Không kết nối được máy chủ. Hãy thử lại.",
			response.status,
		);
	return payload.data;
}
