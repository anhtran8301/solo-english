import type { LinkProps } from "next/link";
import Link from "next/link";
import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

export const LinkBox: React.FC<
	React.HTMLAttributes<HTMLDivElement> & {
		element?: ElementType;
	}
> = ({ children, className, element: Element = "div", ...props }) => {
	return (
		<Element
			{...props}
			className={cn(
				"relative",
				"[&_a:not(.link-overlay)]:relative [&_a:not(.link-overlay)]:z-3",
				"[&_button]:relative [&_button]:z-3",
				className,
			)}
		>
			{children}
		</Element>
	);
};

export const LinkOverlay: React.FC<ComponentProps<"a"> & LinkProps<any>> = ({
	children,
	href,
	className,
	target,
	...props
}) => {
	return (
		<Link
			href={href}
			target={target}
			rel={target === "_blank" ? "noopener noreferrer" : ""}
			{...props}
			className={cn("link-overlay static before:absolute before:inset-0 before:z-2", className)}
		>
			{children}
		</Link>
	);
};
