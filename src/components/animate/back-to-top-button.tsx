"use client";

import { ChevronsUpIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useBackToTop } from "@/hooks/use-back-to-top";
import { cn } from "@/lib/utils";

type BackToTopButtonProps = ButtonProps & {
	isDebounce?: boolean;
	scrollThreshold?: string | number;
};

export function BackToTopButton({
	className,
	isDebounce = true,
	scrollThreshold = "5%",
	...props
}: BackToTopButtonProps) {
	const { onBackToTop, isVisible } = useBackToTop(scrollThreshold, isDebounce);

	return (
		<Button
			type="button"
			aria-label="Back to top"
			size="icon-lg"
			onClick={onBackToTop}
			className={cn(
				"fixed right-4 bottom-68 z-9999 size-12 scale-0 rounded-full opacity-0 transition-transform md:right-8 md:bottom-16",
				isVisible && "scale-100 opacity-100",
				className,
			)}
			{...props}
		>
			<ChevronsUpIcon className="size-6" />
		</Button>
	);
}
