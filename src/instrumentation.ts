export async function onRequestError(err: unknown, request: { path?: string }) {
	console.error("[onRequestError] path:", request?.path);
	console.error("[onRequestError] digest:", (err as { digest?: string })?.digest);
	console.error("[onRequestError] message:", (err as Error)?.message);
	console.error("[onRequestError] stack:", (err as Error)?.stack);
}
