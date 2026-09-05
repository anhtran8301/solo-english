"use client";

import * as React from "react";
import { Slottable } from "@radix-ui/react-slot";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import mergeRefs from "merge-refs";
import { useTabObserver } from "@/hooks/use-tab-observer";
import { cn } from "@/lib/utils";

const TabMenuHorizontalContent = TabsPrimitive.Content;
TabMenuHorizontalContent.displayName = "TabMenuHorizontalContent";

const TabMenuHorizontalRoot = ({
	className,
	...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Root>, "orientation">) => {
	return (
		<TabsPrimitive.Root orientation="horizontal" className={cn("w-full", className)} {...props} />
	);
};
TabMenuHorizontalRoot.displayName = "TabMenuHorizontalRoot";

const TabMenuHorizontalList = ({
	children,
	className,
	wrapperClassName,
	ref,
	...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
	wrapperClassName?: string;
}) => {
	const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });
	const listWrapperRef = React.useRef<HTMLDivElement>(null);

	const { mounted, listRef } = useTabObserver({
		onActiveTabChange: (_, activeTab) => {
			const { offsetWidth: width, offsetLeft: left } = activeTab;
			setLineStyle({ width, left });

			const listWrapper = listWrapperRef.current;
			if (listWrapper) {
				const containerWidth = listWrapper.clientWidth;
				const scrollPosition = left - containerWidth / 2 + width / 2;

				listWrapper.scrollTo({
					left: scrollPosition,
					behavior: "smooth",
				});
			}
		},
	});

	return (
		<div
			ref={listWrapperRef}
			className={cn(
				"relative grid overflow-x-auto overflow-y-hidden overscroll-contain",
				wrapperClassName,
			)}
		>
			<TabsPrimitive.List
				ref={mergeRefs(ref, listRef)}
				className={cn(
					"group/tab-list relative flex h-12 items-center gap-6 whitespace-nowrap border-y",
					className,
				)}
				{...props}
			>
				<Slottable>{children}</Slottable>

				{/* Floating Bg */}
				<div
					className={cn(
						"absolute -bottom-px left-0 h-0.5 bg-primary opacity-0 transition-all duration-300 group-has-data-[state=active]/tab-list:opacity-100",
						{
							hidden: !mounted,
						},
					)}
					style={{
						transform: `translate3d(${lineStyle.left}px, 0, 0)`,
						width: `${lineStyle.width}px`,
						transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
					}}
					aria-hidden="true"
				/>
			</TabsPrimitive.List>
		</div>
	);
};
TabMenuHorizontalList.displayName = "TabMenuHorizontalList";

const TabMenuHorizontalTrigger = ({
	className,
	ref,
	...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) => {
	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(
				// base
				"group/tab-item h-12 py-3.5 text-neutral-600 text-sm/5 outline-none dark:text-neutral-400",
				"flex cursor-pointer items-center justify-center gap-1.5",
				"transition duration-200 ease-out",
				// focus
				"focus:outline-none",
				// active
				"data-[state=active]:text-neutral-800 dark:data-[state=active]:text-neutral-50",
				// disabled
				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				"aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
};
TabMenuHorizontalTrigger.displayName = "TabMenuHorizontalTrigger";

function TabMenuHorizontalIcon<T extends React.ElementType>({
	className,
	as,
	...props
}: React.ComponentPropsWithoutRef<T>) {
	const Component = as || "div";

	return (
		<Component
			className={cn(
				// base
				"size-5 text-neutral-600 dark:text-neutral-400",
				"transition duration-200 ease-out",
				// active
				"group-data-[state=active]/tab-item:text-inverse",
				className,
			)}
			{...props}
		/>
	);
}
TabMenuHorizontalIcon.displayName = "TabsHorizontalIcon";

function TabMenuHorizontalArrowIcon<T extends React.ElementType>({
	className,
	as,
	...props
}: React.ComponentPropsWithoutRef<T>) {
	const Component = as || "div";

	return (
		<Component
			className={cn("size-5 text-neutral-600 dark:text-neutral-400", className)}
			{...props}
		/>
	);
}
TabMenuHorizontalArrowIcon.displayName = "TabsHorizontalArrow";

export {
	TabMenuHorizontalArrowIcon,
	TabMenuHorizontalContent,
	TabMenuHorizontalIcon,
	TabMenuHorizontalList,
	TabMenuHorizontalRoot as TabMenuHorizontal,
	TabMenuHorizontalTrigger,
};
