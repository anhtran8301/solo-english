import { useMemo, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { GripVerticalIcon, Settings2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sortable, SortableDragHandle, SortableItem } from "@/components/ui/sortable";

type Props<TData> = {
	table: Table<TData>;
	disableColumnOrdering?: boolean;
};

export function DataTableViewOptions<TData>({
	table,
	disableColumnOrdering = false,
}: Props<TData>) {
	const [open, setOpen] = useState(false);
	const [drag, setDrag] = useState(false);
	const [search, setSearch] = useState("");

	const columnOrder = table.getState().columnOrder;

	const sortedColumns = useMemo(
		() =>
			table.getAllColumns().sort((a, b) => columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id)),
		[columnOrder, table.getAllColumns],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon-sm" role="combobox" aria-expanded={open}>
					<Settings2Icon className="size-4" />
					<span className="sr-only">View</span>
				</Button>
			</PopoverTrigger>
			<PopoverContent side="bottom" align="end" className="w-60 p-0">
				<Command>
					<CommandInput value={search} onValueChange={setSearch} placeholder="Tìm kiếm..." />
					<CommandList>
						<CommandEmpty>Không tìm thấy tùy chọn.</CommandEmpty>
						<CommandGroup>
							<Sortable
								value={sortedColumns.map((c) => ({ id: c.id }))}
								onValueChange={(items) => table.setColumnOrder(items.map((c) => c.id))}
								overlay={<div className="h-8 w-full rounded-md bg-muted/60" />}
								onDragStart={() => setDrag(true)}
								onDragEnd={() => setDrag(false)}
								onDragCancel={() => setDrag(false)}
							>
								{sortedColumns
									.filter(
										(column) => typeof column.accessorFn !== "undefined" && column.getCanHide(),
									)
									.map((column) => (
										<SortableItem key={column.id} value={column.id} asChild>
											<CommandItem
												value={column.id}
												keywords={[
													column.columnDef?.meta?.header ||
														(typeof column.columnDef.header === "string"
															? column.columnDef.header
															: column.id) ||
														column.id,
												]}
												onSelect={() => column.toggleVisibility(!column.getIsVisible())}
												disabled={drag}
											>
												<Checkbox
													checked={column.getIsVisible()}
													onCheckedChange={(value) => column.toggleVisibility(!!value)}
													className="**:text-primary-foreground!"
												/>
												<span>
													{column.columnDef?.meta?.header ||
														(typeof column.columnDef.header === "string"
															? column.columnDef.header
															: column.id) ||
														column.id}
												</span>
												{!disableColumnOrdering && !search ? (
													<SortableDragHandle
														variant="ghost"
														size="icon"
														className="ml-auto size-5 text-muted-foreground hover:text-foreground focus:bg-muted focus:text-foreground"
													>
														<GripVerticalIcon className="size-4" aria-hidden="true" />
													</SortableDragHandle>
												) : null}
											</CommandItem>
										</SortableItem>
									))}
							</Sortable>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
