import { expect, test } from "bun:test";
import { move, stageNeighbor } from "./order";

test("question ordering skips other stages and preserves content", () => {
	const items = [
		{ stage: "LEARN", id: "a" },
		{ stage: "USE", id: "b" },
		{ stage: "LEARN", id: "c" },
	];
	expect(stageNeighbor(items, 0, -1)).toBe(0);
	expect(stageNeighbor(items, 2, 1)).toBe(2);
	const target = stageNeighbor(items, 0, 1);
	expect(move(items, 0, target).map((item) => item.id)).toEqual(["c", "b", "a"]);
	expect(items[0].id).toBe("a");
	expect(move(items, 0, -1)).toBe(items);
	expect(move(items, 1, -1).map((item) => item.id)).toEqual(["b", "a", "c"]);
});
