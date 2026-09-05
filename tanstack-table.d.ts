import "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface ColumnMeta {
		header?: string;
		className?: string;
		headerClassName?: string;
		cellClassName?: string;
		disableMenuActions?: boolean;
		// Resizing
		isGrow?: boolean;
		widthPercentage?: number;
	}
}
