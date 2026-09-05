import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-md border p-3 text-sm", {
	variants: {
		variant: {
			default: "bg-muted/40 text-foreground",
			info: "border-info/30 bg-info/10 text-info-foreground",
			success: "border-success/30 bg-success/10 text-success-foreground",
			destructive: "border-destructive/30 bg-destructive/10 text-destructive-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return <div data-slot="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export { Alert };
