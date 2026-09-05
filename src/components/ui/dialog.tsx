"use client";

import type * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in",
				className,
			)}
			{...props}
		/>
	);
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
	/**
	 * Radix modal mặc định `disableOutsidePointerEvents` → body không nhận pointer;
	 * dropdown (Combobox/Select) portal ra body sẽ không click được. Bật khi dialog có popover portal.
	 */
	allowPortaledPopovers?: boolean;
	overlayClassName?: string;
};

function DialogContent({
	className,
	children,
	onPointerDownOutside,
	allowPortaledPopovers,
	overlayClassName,
	...props
}: DialogContentProps) {
	const handlePointerDownOutside: React.ComponentProps<
		typeof DialogPrimitive.Content
	>["onPointerDownOutside"] = (event) => {
		const target = event.detail.originalEvent.target;
		if (
			target instanceof Element &&
			(target.closest('[data-slot="combobox-content"]') ||
				target.closest('[data-slot="select-content"]'))
		) {
			event.preventDefault();
		}
		onPointerDownOutside?.(event);
	};

	const DialogPrimitiveContent = DialogPrimitive.Content as React.ComponentType<
		React.ComponentProps<typeof DialogPrimitive.Content> & {
			disableOutsidePointerEvents?: boolean;
		}
	>;

	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay className={overlayClassName} />
			<div className="relative size-fit">
				<DialogPrimitiveContent
					data-slot="dialog-content"
					className={cn(
						"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg",
						"flex max-h-[calc(100vh-4rem)] flex-col gap-0 overflow-hidden p-0",
						className,
					)}
					{...props}
					{...(allowPortaledPopovers ? { disableOutsidePointerEvents: false as const } : {})}
					onPointerDownOutside={handlePointerDownOutside}
				>
					{children}
				</DialogPrimitiveContent>
			</div>
		</DialogPortal>
	);
}

function DialogHeader({
	className,
	showCloseButton = true,
	...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
	return (
		<>
			<div
				data-slot="dialog-header"
				className={cn(
					"flex flex-col gap-2 border-b p-4 text-center sm:px-6 sm:text-left",
					className,
				)}
				{...props}
			/>
			{showCloseButton && (
				<DialogPrimitive.Close
					asChild
					data-slot="dialog-close"
					className="absolute top-2 right-2 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
				>
					<Button size="icon-sm" variant="ghost">
						<XIcon />
						<span className="sr-only">Close</span>
					</Button>
				</DialogPrimitive.Close>
			)}
		</>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-3 border-t bg-muted/50 p-4 sm:flex-row sm:justify-end sm:px-6",
				className,
			)}
			{...props}
		/>
	);
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-body"
			className={cn(
				"min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("font-semibold leading-none", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
