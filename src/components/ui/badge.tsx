import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-transparent font-medium outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 [&_svg:not([class*='size-'])]:size-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [button,a&]:cursor-pointer [button,a&]:pointer-coarse:after:absolute [button,a&]:pointer-coarse:after:size-full [button,a&]:pointer-coarse:after:min-h-11 [button,a&]:pointer-coarse:after:min-w-11",
	{
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			size: {
				default: "h-6 gap-1 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-7.5 gap-1.5 px-3 text-sm [&_svg:not([class*='size-'])]:size-4",
				sm: "h-5 gap-1 rounded-[calc(var(--radius-sm)-2px)] px-2 text-[.6875rem] [&_svg:not([class*='size-'])]:size-3",
			},
			variant: {
				default: "bg-primary text-primary-foreground [button,a&]:hover:bg-primary/90",
				"default-subtle": "bg-primary/12 text-primary dark:bg-primary/24",
				outline:
					"border-border bg-transparent dark:bg-input/32 [button,a&]:hover:bg-accent/50 dark:[button,a&]:hover:bg-input/48",
				secondary: "bg-secondary text-secondary-foreground [button,a&]:hover:bg-secondary/90",
				error: "bg-destructive text-white [button,a&]:hover:bg-destructive/90",
				"error-subtle": "bg-destructive/12 text-destructive-foreground dark:bg-destructive/24",
				info: "bg-info text-white [button,a&]:hover:bg-info/90",
				"info-subtle": "bg-info/12 text-info-foreground dark:bg-info/24",
				success: "bg-success text-white [button,a&]:hover:bg-success/90",
				"success-subtle": "bg-success/12 text-success-foreground dark:bg-success/24",
				warning: "bg-warning text-black [button,a&]:hover:bg-warning/90",
				"warning-subtle": "bg-warning/12 text-warning-foreground dark:bg-warning/24",
				gray: "bg-[oklch(0.65_0_0)] text-white",
				"gray-subtle": "bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
				inverted: "bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900",
			},
		},
	},
);

type BadgeProps = React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean };

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, type BadgeProps, badgeVariants };
