import type * as React from "react";
import { cn } from "@/lib/utils";

function Frame({
	className,
	shadow,
	stackedPanels = false,
	...props
}: React.ComponentProps<"div"> & { shadow?: boolean; stackedPanels?: boolean }) {
	return (
		<div
			data-slot="frame"
			className={cn(
				"relative flex flex-col rounded-2xl border bg-muted p-1",
				stackedPanels
					? "*:has-[+[data-slot=frame-panel]]:rounded-b-none *:has-[+[data-slot=frame-panel]]:before:hidden dark:*:has-[+[data-slot=frame-panel]]:before:block *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:rounded-t-none *:[[data-slot=frame-panel]+[data-slot=frame-panel]]:border-t-0 dark:*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:before:hidden"
					: "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:mt-1",
				shadow &&
					"relative flex min-w-0 flex-col rounded-xl border bg-muted bg-clip-padding p-1 before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_2px_1px_--theme(--color-black/4%)] after:pointer-events-none after:absolute after:-inset-[5px] after:rounded-[calc(var(--radius-xl)+4px)] after:border after:border-border/50 after:bg-clip-padding dark:after:bg-background/72",
				className,
			)}
			{...props}
		/>
	);
}

function FramePanel({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame-panel"
			className={cn(
				"relative -mx-px rounded-xl border bg-background bg-clip-padding p-5 shadow-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-xl)-1px)] before:shadow-[0_1px_--theme(--color-black/4%)] dark:bg-clip-border dark:before:shadow-[0_-1px_--theme(--color-white/8%)]",

				className,
			)}
			{...props}
		/>
	);
}

function FrameHeader({ className, ...props }: React.ComponentProps<"header">) {
	return (
		<header
			data-slot="frame-panel-header"
			className={cn("flex flex-col px-3 pt-1.5 pb-2.5", className)}
			{...props}
		/>
	);
}

function FrameTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame-panel-title"
			className={cn("font-semibold text-sm", className)}
			{...props}
		/>
	);
}

function FrameDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="frame-panel-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function FrameFooter({ className, ...props }: React.ComponentProps<"footer">) {
	return (
		<footer
			data-slot="frame-panel-footer"
			className={cn("flex flex-col gap-1 px-5 py-4", className)}
			{...props}
		/>
	);
}

export { Frame, FrameDescription, FrameFooter, FrameHeader, FramePanel, FrameTitle };
