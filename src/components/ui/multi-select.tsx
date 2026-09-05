"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type MultiSelectOption = {
	value: string;
	label: React.ReactNode;
	keywords?: string[];
	disabled?: boolean;
};

export type MultiSelectGroup = {
	heading: string;
	options: MultiSelectOption[];
};

export type MultiSelectProps = {
	value: string[];
	onValueChange: (next: string[]) => void;
	/** Danh sách phẳng (một nhóm, không tiêu đề) */
	options?: MultiSelectOption[];
	/** Hoặc nhiều nhóm có heading (ưu tiên hơn `options` nếu có phần tử) */
	groups?: MultiSelectGroup[];
	placeholder?: string;
	searchPlaceholder?: string;
	emptyText?: string;
	disabled?: boolean;
	className?: string;
	triggerClassName?: string;
	/** Dùng trong Dialog: tránh focus trap */
	modal?: boolean;
	/** Chỉ hiển thị tối đa N chip, phần còn lại "+k" */
	maxDisplayed?: number;
	id?: string;
	"aria-invalid"?: boolean;
};

function normalizeSections(
	options: MultiSelectOption[] | undefined,
	groups: MultiSelectGroup[] | undefined,
): MultiSelectGroup[] {
	if (groups?.length) return groups;
	return [{ heading: "", options: options ?? [] }];
}

function findOptionByCmdValue(
	sections: MultiSelectGroup[],
	cmdValue: string,
): MultiSelectOption | undefined {
	const lower = cmdValue.toLowerCase();
	for (const section of sections) {
		for (const opt of section.options) {
			if (opt.value.toLowerCase() === lower) return opt;
		}
	}
	return undefined;
}

function optionByValue(sections: MultiSelectGroup[], value: string): MultiSelectOption | undefined {
	for (const section of sections) {
		const found = section.options.find((o) => o.value === value);
		if (found) return found;
	}
	return undefined;
}

export function MultiSelect({
	value,
	onValueChange,
	options,
	groups,
	placeholder = "Chọn…",
	searchPlaceholder = "Tìm kiếm…",
	emptyText = "Không có kết quả.",
	disabled = false,
	className,
	triggerClassName,
	modal = false,
	maxDisplayed,
	id,
	"aria-invalid": ariaInvalid,
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);

	const sections = React.useMemo(() => normalizeSections(options, groups), [options, groups]);

	const toggle = React.useCallback(
		(opt: MultiSelectOption) => {
			if (opt.disabled) return;
			const set = new Set(value);
			if (set.has(opt.value)) {
				set.delete(opt.value);
			} else {
				set.add(opt.value);
			}
			onValueChange(Array.from(set));
		},
		[value, onValueChange],
	);

	const remove = React.useCallback(
		(v: string, e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onValueChange(value.filter((x) => x !== v));
		},
		[value, onValueChange],
	);

	const displayed =
		maxDisplayed != null && value.length > maxDisplayed ? value.slice(0, maxDisplayed) : value;
	const overflow = maxDisplayed != null ? Math.max(0, value.length - displayed.length) : 0;

	return (
		<Popover open={open} onOpenChange={setOpen} modal={modal}>
			<PopoverTrigger asChild disabled={disabled}>
				<button
					type="button"
					id={id}
					role="combobox"
					aria-expanded={open}
					aria-invalid={ariaInvalid}
					className={cn(
						"flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 text-left text-sm shadow-xs outline-none transition-[color,box-shadow]",
						"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"dark:bg-input/30",
						ariaInvalid && "border-destructive ring-destructive/20 dark:ring-destructive/40",
						triggerClassName,
						className,
					)}
				>
					{value.length === 0 ? (
						<span className="text-muted-foreground">{placeholder}</span>
					) : (
						<>
							{displayed.map((v) => {
								const opt = optionByValue(sections, v);
								return (
									<Badge
										key={v}
										variant="secondary"
										className="h-6 max-w-full gap-0.5 rounded-md px-1.5 py-0 font-normal"
										asChild
									>
										<span className="inline-flex items-center gap-0.5">
											<span className="max-w-[160px] truncate">{opt?.label ?? v}</span>
											<button
												type="button"
												className="rounded-sm p-0.5 opacity-70 hover:bg-muted hover:opacity-100"
												aria-label={`Gỡ ${typeof opt?.label === "string" ? opt.label : v}`}
												onClick={(e) => remove(v, e)}
											>
												<XIcon className="size-3" />
											</button>
										</span>
									</Badge>
								);
							})}
							{overflow > 0 ? (
								<Badge variant="outline" className="h-6 rounded-md px-1.5 font-normal">
									+{overflow}
								</Badge>
							) : null}
						</>
					)}
					<ChevronsUpDownIcon className="ml-auto size-4 shrink-0 opacity-50" aria-hidden />
				</button>
			</PopoverTrigger>
			<PopoverContent fitTrigger className="p-0" align="start">
				<Command>
					<CommandInput placeholder={searchPlaceholder} className="h-9" />
					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>
						{sections.map((section, idx) => (
							<CommandGroup
								key={section.heading || `section-${idx}`}
								{...(section.heading ? { heading: section.heading } : {})}
							>
								{section.options.map((opt) => {
									const selected = value.includes(opt.value);
									return (
										<CommandItem
											key={opt.value}
											value={opt.value}
											keywords={opt.keywords}
											disabled={opt.disabled}
											onSelect={(cmdVal) => {
												const hit = findOptionByCmdValue(sections, cmdVal);
												if (hit) toggle(hit);
											}}
										>
											<span className="min-w-0 flex-1 truncate">{opt.label}</span>
											<CheckIcon
												className={cn(
													"ml-auto size-4 shrink-0",
													selected ? "opacity-100" : "opacity-0",
												)}
											/>
										</CommandItem>
									);
								})}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
