import { expect, test } from "bun:test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { ImportDestination } from "./library";
import type { Collection } from "./types";

function render(collections: Collection[], topicId = "") {
	return renderToStaticMarkup(
		<QueryClientProvider client={new QueryClient()}>
			<ImportDestination collections={collections} topicId={topicId} onSelect={() => {}} />
		</QueryClientProvider>,
	);
}
const collection: Collection = { id: "collection", name: "Giao tiếp", position: 0, topics: [] };

test("empty import destination offers collection creation instead of an empty selector", () => {
	const html = render([]);
	expect(html).toContain("Chưa có chủ đề để lưu bài");
	expect(html).toContain("bộ sưu tập");
	expect(html).toContain('name="name"');
	expect(html).not.toContain('name="topicId"');
	expect(html).not.toContain("Hủy");
});

test("collection without topics offers an inline topic form", () => {
	const html = render([collection]);
	expect(html).toContain('name="collectionId"');
	expect(html).toContain('name="name"');
	expect(html).toContain("chủ đề");
	expect(html).not.toContain('name="topicId"');
});

test("existing topics are grouped and the selected destination is retained", () => {
	const html = render(
		[
			{
				...collection,
				topics: [
					{
						id: "topic",
						name: "Nhà hàng",
						collectionId: collection.id,
						position: 0,
						lessons: [],
					},
				],
			},
		],
		"topic",
	);
	expect(html).toContain('<optgroup label="Giao tiếp">');
	expect(html).toContain('<option value="topic" selected="">Nhà hàng</option>');
	expect(html).toContain("Tạo chủ đề mới");
	expect(html).not.toContain('name="name"');
});
