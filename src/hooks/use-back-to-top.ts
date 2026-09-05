"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export type UseBackToTopReturn = {
	isVisible: boolean;
	onBackToTop: () => void;
	setIsVisible: Dispatch<SetStateAction<boolean>>;
};

export function useBackToTop(
	defaultValue: string | number,
	isDebounce?: boolean,
): UseBackToTopReturn {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const prefersReducedMotion = usePrefersReducedMotion();

	const parseValue = parseValueInput(defaultValue);

	const handleScroll = useCallback(() => {
		const windowInnerHeight = window.innerHeight;
		const windowScrollY = Math.round(window.scrollY);
		const documentOffsetHeight = document.body.offsetHeight;

		const scrollProgress = Math.round(
			(windowScrollY / (documentOffsetHeight - windowInnerHeight)) * 100,
		);

		if (parseValue.type === "percentage") {
			setIsVisible(scrollProgress >= parseValue.value);
		} else {
			const distanceValue = documentOffsetHeight - windowInnerHeight - windowScrollY;
			setIsVisible(parseValue.value >= distanceValue);
		}
	}, [parseValue.type, parseValue.value]);

	const debouncedHandleScroll = useMemo(() => {
		let timeoutId: NodeJS.Timeout;

		return () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(handleScroll, 100);
		};
	}, [handleScroll]);

	useEffect(() => {
		const scrollHandler = isDebounce ? debouncedHandleScroll : handleScroll;

		window.addEventListener("scroll", scrollHandler);

		return () => {
			window.removeEventListener("scroll", scrollHandler);
		};
	}, [debouncedHandleScroll, handleScroll, isDebounce]);

	const onBackToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: prefersReducedMotion ? "auto" : "smooth",
		});
	};

	return {
		isVisible,
		onBackToTop,
		setIsVisible,
	};
}

function parseValueInput(inputValue: string | number): { value: number; type: string } {
	let value: number;
	let type: string;

	if (typeof inputValue === "string") {
		if (inputValue.endsWith("%")) {
			value = Number(inputValue.slice(0, -1));
			if (Number.isNaN(value)) {
				throw new Error("Invalid percentage value");
			}
			type = "percentage";
		} else {
			throw new Error("String input must end with %");
		}
	} else {
		value = inputValue;
		type = "number";
	}

	return { value, type };
}
