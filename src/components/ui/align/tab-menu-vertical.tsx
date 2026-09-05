"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const TabMenuVerticalContent = TabsPrimitive.Content;
TabMenuVerticalContent.displayName = "TabMenuVerticalContent";

type TabMenuVerticalRootProps = Omit<
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
	"orientation"
>;

const TabMenuVerticalRoot = React.forwardRef<
	React.ComponentRef<typeof TabsPrimitive.Root>,
	TabMenuVerticalRootProps
>(({ ...rest }, forwardedRef) => {
	return <TabsPrimitive.Root ref={forwardedRef} orientation="vertical" {...rest} />;
});
TabMenuVerticalRoot.displayName = "TabMenuVerticalRoot";

const TabMenuVerticalList = React.forwardRef<
	React.ComponentRef<typeof TabsPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...rest }, forwardedRef) => {
	return (
		<TabsPrimitive.List
			ref={forwardedRef}
			className={cn("w-full space-y-2", className)}
			{...rest}
		/>
	);
});
TabMenuVerticalList.displayName = "TabMenuVerticalList";

const TabMenuVerticalTrigger = React.forwardRef<
	React.ComponentRef<typeof TabsPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...rest }, forwardedRef) => {
	return (
		<TabsPrimitive.Trigger
			ref={forwardedRef}
			className={cn(
				// base
				"group/tab-item w-full cursor-pointer rounded-md p-2 text-left text-neutral-600 text-sm/5 outline-none dark:text-neutral-400",
				"grid auto-cols-auto grid-flow-col grid-cols-[auto,minmax(0,1fr)] items-center gap-1.5",
				"transition duration-200 ease-out",
				// hover
				"hover:bg-neutral-50 dark:hover:bg-neutral-800",
				// focus
				"focus:outline-none",
				// active
				"data-[state=active]:bg-neutral-50 data-[state=active]:font-medium data-[state=active]:text-primary dark:data-[state=active]:bg-neutral-800",
				// disabled
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...rest}
		/>
	);
});
TabMenuVerticalTrigger.displayName = "TabMenuVerticalTrigger";

function TabMenuVerticalIcon<T extends React.ElementType>({
	className,
	as,
	...rest
}: React.ComponentPropsWithoutRef<T>) {
	const Component = as || "div";

	return (
		<Component
			className={cn(
				// base
				"size-5! text-neutral-600 dark:text-neutral-400",
				"transition duration-200 ease-out",
				// active
				"group-data-[state=active]/tab-item:text-primary",
				className,
			)}
			{...rest}
		/>
	);
}
TabMenuVerticalIcon.displayName = "TabsVerticalIcon";

function TabMenuVerticalArrowIcon<T extends React.ElementType>({
	className,
	as,
	...rest
}: React.ComponentPropsWithoutRef<T>) {
	const Component = as || "div";

	return (
		<Component
			className={cn(
				// base
				"size-5 p-px text-neutral-600 dark:text-neutral-400",
				"rounded-full bg-neutral-50 opacity-0 shadow-xs dark:bg-neutral-950",
				"scale-75 transition ease-out",
				// active
				"group-data-[state=active]/tab-item:scale-100 group-data-[state=active]/tab-item:text-primary group-data-[state=active]/tab-item:opacity-100",
				className,
			)}
			{...rest}
		/>
	);
}
TabMenuVerticalArrowIcon.displayName = "TabMenuVerticalArrowIcon";

export {
	TabMenuVerticalArrowIcon,
	TabMenuVerticalContent,
	TabMenuVerticalIcon,
	TabMenuVerticalList,
	TabMenuVerticalRoot as TabMenuVertical,
	TabMenuVerticalTrigger,
};
