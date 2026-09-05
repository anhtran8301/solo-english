import type * as React from "react";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ChevronsLeftIcon,
	ChevronsRightIcon,
	MoreHorizontalIcon,
} from "lucide-react";
import { type Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
	return <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

function PaginationItem(props: React.ComponentProps<"li">) {
	return <li {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
	React.ComponentProps<"button">;

function PaginationLink({
	className,
	isActive,
	size = "icon",
	children,
	...props
}: PaginationLinkProps) {
	return (
		<button
			type="button"
			aria-current={isActive ? "page" : undefined}
			className={cn(
				buttonVariants({
					variant: isActive ? "outline" : "ghost",
					size,
				}),
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}

function PaginationFirst(props: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink aria-label="Đi tới trang đầu" size="icon" {...props}>
			<ChevronsLeftIcon className="size-4" />
		</PaginationLink>
	);
}

function PaginationPrevious(props: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink aria-label="Đi tới trang trước" size="icon" {...props}>
			<ChevronLeftIcon className="size-4" />
		</PaginationLink>
	);
}

function PaginationNext(props: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink aria-label="Đi tới trang sau" size="icon" {...props}>
			<ChevronRightIcon className="size-4" />
		</PaginationLink>
	);
}

function PaginationLast(props: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink aria-label="Đi tới trang cuối" size="icon" {...props}>
			<ChevronsRightIcon className="size-4" />
		</PaginationLink>
	);
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			className={cn("flex size-10 items-center justify-center", className)}
			{...props}
		>
			<MoreHorizontalIcon className="size-4" />
			<span className="sr-only">Nhiều trang hơn</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationFirst,
	PaginationItem,
	PaginationLast,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
