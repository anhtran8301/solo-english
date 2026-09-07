import { expect, test } from "bun:test";
import { initials } from "./initials";

test("avatar initials handle Vietnamese, single names and whitespace", () => {
	expect(initials(" Nguyễn Đại Đồng ")).toBe("ĐĐ");
	expect(initials("Lan")).toBe("L");
	expect(initials("  ")).toBe("U");
});
