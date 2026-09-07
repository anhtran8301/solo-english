"use client";
import { useEffect } from "react";
export function useUnsaved(dirty: boolean) {
	useEffect(() => {
		if (!dirty) return;
		const before = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		const click = (e: MouseEvent) => {
			const a = (e.target as Element).closest?.("a[href]");
			if (
				a &&
				!a.hasAttribute("download") &&
				!window.confirm("Bạn có thay đổi chưa lưu. Rời trang?")
			) {
				e.preventDefault();
				e.stopPropagation();
			}
		};
		window.addEventListener("beforeunload", before);
		document.addEventListener("click", click, true);
		return () => {
			window.removeEventListener("beforeunload", before);
			document.removeEventListener("click", click, true);
		};
	}, [dirty]);
}
