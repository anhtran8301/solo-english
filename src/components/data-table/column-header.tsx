import type { Column } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue> extends Omit<ButtonProps, "title"> {
	column: Column<TData, TValue>;
	title: React.ReactNode | string;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
	...props
}: DataTableColumnHeaderProps<TData, TValue>) {
	const isSorted = column.getIsSorted();

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => {
				column.toggleSorting(undefined);
			}}
			className={cn(
				"group flex h-7 w-full items-center justify-between gap-2 px-0 py-0 hover:bg-transparent hover:**:text-primary",
				className?.includes("text-right") && "justify-end",
			)}
			{...props}
		>
			<span>{title}</span>
			<span
				className={cn(
					"flex flex-col opacity-0",
					isSorted && "opacity-80",
					"group-hover:opacity-100",
				)}
			>
				<ChevronUpIcon
					className={cn(
						"-mb-0.5 size-3.5",
						column.getIsSorted() === "asc" ? "text-faded" : "text-muted-foreground/50",
					)}
				/>
				<ChevronDownIcon
					className={cn(
						"-mt-0.5 size-3.5",
						column.getIsSorted() === "desc" ? "text-faded" : "text-muted-foreground/50",
					)}
				/>
			</span>
		</Button>
	);
}
