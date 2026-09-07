import { expect, test } from "bun:test";
import { QueryObserver } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";

test("an invalidated inactive list refetches when its route mounts again", async () => {
	const client = getQueryClient();
	let rows: string[] = [];
	const options = { queryKey: ["learning", "exams"], queryFn: async () => rows };
	await client.fetchQuery(options);
	rows = ["new exam"];
	await client.invalidateQueries({ queryKey: ["learning"] });
	const observer = new QueryObserver(client, options);
	let unsubscribe = () => {};
	try {
		await new Promise<void>((resolve, reject) => {
			const timeout = setTimeout(() => reject(new Error("Invalidated list did not refetch")), 1000);
			unsubscribe = observer.subscribe((result) => {
				if (!result.isFetching && result.data?.length) {
					clearTimeout(timeout);
					resolve();
				}
			});
		});
		expect(client.getQueryData<string[]>(options.queryKey)).toEqual(["new exam"]);
	} finally {
		unsubscribe();
		client.clear();
	}
});
