import { expect, test } from "bun:test";
import { ApiError, apiRequest } from "./api-client";

test("API requests use cookies and retain field-path validation errors", async () => {
	const original = globalThis.fetch;
	let credentials: RequestCredentials | undefined;
	globalThis.fetch = (async (_url: unknown, init?: RequestInit) => {
		credentials = init?.credentials;
		return Response.json(
			{ success: false, message: ["knowledgeItems.0.term: Required"] },
			{ status: 400 },
		);
	}) as unknown as typeof fetch;
	try {
		await expect(apiRequest("lessons", { method: "POST", body: "{}" })).rejects.toThrow(
			"knowledgeItems.0.term",
		);
		expect(credentials).toBe("include");
	} finally {
		globalThis.fetch = original;
	}
});

test("offline errors are actionable and do not silently return empty data", async () => {
	const original = globalThis.fetch;
	globalThis.fetch = (async () => {
		throw new TypeError("Failed to fetch");
	}) as unknown as typeof fetch;
	try {
		await expect(apiRequest("collections")).rejects.toBeInstanceOf(ApiError);
		await expect(apiRequest("collections")).rejects.toThrow("Dữ liệu nhập vẫn được giữ");
	} finally {
		globalThis.fetch = original;
	}
});
