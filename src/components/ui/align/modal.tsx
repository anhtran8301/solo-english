// AlignUI Modal v0.0.0

import type * as React from "react";
import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Button } from "../button";

const ModalRoot = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

const ModalOverlay = ({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) => {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				// base #3333333d #3333338f
				"fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-[#3333333d] p-4 backdrop-blur-[10px] dark:bg-[#3333338f]",
				// animation
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=open]:animate-in",
				className,
			)}
			{...props}
		/>
	);
};
ModalOverlay.displayName = "ModalOverlay";

const ModalContent = ({
	className,
	overlayClassName,
	animate,
	children,
	showClose,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	overlayClassName?: string;
	showClose?: boolean;
	animate?: "fade" | "slide";
}) => {
	return (
		<ModalPortal>
			<ModalOverlay className={overlayClassName}>
				<DialogPrimitive.Content
					className={cn(
						// base
						"relative w-full max-w-lg",
						"rounded-[20px] bg-card shadow-md",
						// focus
						"focus:outline-none",
						// animation
						"data-[state=closed]:animate-out data-[state=open]:animate-in",
						"duration-200",
						animate === "fade" && "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
						animate === "fade" && "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
						animate === "slide" && "data-[state=closed]:ease-in data-[state=open]:ease-out",
						animate === "slide" &&
							"data-[state=open]:slide-in-from-top-6 data-[state=closed]:slide-out-to-top-6",
						className,
					)}
					{...props}
				>
					<DialogPrimitive.Title className="sr-only">Modal</DialogPrimitive.Title>
					{children}
					{showClose && (
						<ModalClose asChild>
							<Button variant="ghost" size="icon" className="absolute top-2 right-2">
								<XIcon className="size-4" />
							</Button>
						</ModalClose>
					)}
				</DialogPrimitive.Content>
			</ModalOverlay>
		</ModalPortal>
	);
};
ModalContent.displayName = "ModalContent";

function ModalHeader({
	className,
	children,
	icon,
	title,
	description,
	...props
}: React.HTMLAttributes<HTMLDivElement> & {
	icon?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				"relative flex items-start gap-3.5 py-4 pr-14 pl-5 before:absolute before:inset-x-0 before:bottom-0 before:border-border before:border-b",
				className,
			)}
			{...props}
		>
			{children || (
				<>
					{icon && (
						<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-50 ring-1 ring-neutral-200 ring-inset dark:bg-neutral-950 dark:ring-neutral-700">
							{icon}
						</div>
					)}
					{(title || description) && (
						<div className="flex-1 space-y-1">
							{title && <ModalTitle>{title}</ModalTitle>}
							{description && <ModalDescription>{description}</ModalDescription>}
						</div>
					)}
				</>
			)}
		</div>
	);
}
ModalHeader.displayName = "ModalHeader";

const ModalTitle = ({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) => {
	return (
		<DialogPrimitive.Title
			className={cn("font-medium text-inverse text-sm/5", className)}
			{...props}
		/>
	);
};
ModalTitle.displayName = "ModalTitle";

const ModalDescription = ({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) => {
	return (
		<DialogPrimitive.Description className={cn("text-faded text-xs/4", className)} {...props} />
	);
};
ModalDescription.displayName = "ModalDescription";

function ModalBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return <div className={cn("p-5", className)} {...props} />;
}
ModalBody.displayName = "ModalBody";

function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("flex items-center justify-between gap-3 border-t px-5 py-4", className)}
			{...props}
		/>
	);
}

ModalFooter.displayName = "ModalFooter";

export {
	ModalBody,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	ModalPortal,
	ModalRoot as Modal,
	ModalTitle,
	ModalTrigger,
};
