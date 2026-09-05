// AlignUI Badge v0.0.0

import * as React from "react";
import { Slot } from "radix-ui";
import {
	type PolymorphicComponentProps,
	recursiveCloneChildren,
	tv,
	type VariantProps,
} from "@/lib/utils";

const BADGE_ROOT_NAME = "BadgeRoot";
const BADGE_ICON_NAME = "BadgeIcon";
const BADGE_DOT_NAME = "BadgeDot";

export const badgeVariants = tv({
	slots: {
		root: "inline-flex w-fit items-center justify-center rounded-full leading-none transition duration-200 ease-out",
		icon: "shrink-0",
		dot: [
			// base
			"dot",
			"flex items-center justify-center",
			// before
			"before:size-1 before:rounded-full before:bg-current",
		],
	},
	variants: {
		size: {
			small: {
				root: "h-4 gap-1.5 px-2 py-1 text-[10px] uppercase has-[>.dot]:gap-2",
				icon: "-mx-1 size-3",
				dot: "-mx-2 size-4",
			},
			medium: {
				root: "h-5 gap-1.5 px-2 text-xs/6",
				icon: "-mx-1 size-4",
				dot: "-mx-1.5 size-4",
			},
			large: {
				root: "h-6.5 gap-1.5 px-3! text-sm/6",
				icon: "-mx-1 size-5",
				dot: "-mx-1.5 size-5",
			},
		},
		variant: {
			filled: { root: "text-white" },
			light: {},
			lighter: {},
			stroke: { root: "ring-1 ring-current ring-inset" },
			fancy: { root: "group relative rounded-none border border-dashed px-1.5" },
		},
		color: {
			gray: {},
			blue: {},
			orange: {},
			red: {},
			green: {},
			yellow: {},
			purple: {},
			sky: {},
			pink: {},
			teal: {},
		},
		disabled: {
			true: {
				root: "pointer-events-none",
			},
		},
		square: {
			true: {},
		},
		bordered: {
			true: {
				root: "border",
			},
		},
	},
	compoundVariants: [
		//#region variant=filled
		{ variant: "filled", color: "gray", class: { root: "bg-faded" } },
		{ variant: "filled", color: "blue", class: { root: "bg-info" } },
		{ variant: "filled", color: "orange", class: { root: "bg-warning" } },
		{ variant: "filled", color: "red", class: { root: "bg-error" } },
		{ variant: "filled", color: "green", class: { root: "bg-success" } },
		{ variant: "filled", color: "yellow", class: { root: "bg-away" } },
		{ variant: "filled", color: "purple", class: { root: "bg-feature" } },
		{ variant: "filled", color: "sky", class: { root: "bg-verified" } },
		{ variant: "filled", color: "pink", class: { root: "bg-highlighted" } },
		{ variant: "filled", color: "teal", class: { root: "bg-stable" } },
		// #endregion

		//#region variant=light
		{ variant: "light", color: "gray", class: { root: "bg-faded-light text-faded-dark" } },
		{ variant: "light", color: "blue", class: { root: "bg-info-light text-info-dark" } },
		{ variant: "light", color: "orange", class: { root: "bg-warning-light text-warning-dark" } },
		{ variant: "light", color: "red", class: { root: "bg-error-light text-error-dark" } },
		{ variant: "light", color: "green", class: { root: "bg-success-light text-success-dark" } },
		{ variant: "light", color: "yellow", class: { root: "bg-away-light text-away-dark" } },
		{ variant: "light", color: "purple", class: { root: "bg-feature-light text-feature-dark" } },
		{ variant: "light", color: "sky", class: { root: "bg-verified-light text-verified-dark" } },
		{
			variant: "light",
			color: "pink",
			class: { root: "bg-highlighted-light text-highlighted-dark" },
		},
		{ variant: "light", color: "teal", class: { root: "bg-stable-light text-stable-dark" } },
		//#endregion

		//#region variant=lighter
		{ variant: "lighter", color: "gray", class: { root: "bg-faded-lighter text-faded" } },
		{ variant: "lighter", color: "blue", class: { root: "bg-info-lighter text-info" } },
		{ variant: "lighter", color: "orange", class: { root: "bg-warning-lighter text-warning" } },
		{ variant: "lighter", color: "red", class: { root: "bg-error-lighter text-error" } },
		{ variant: "lighter", color: "green", class: { root: "bg-success-lighter text-success" } },
		{ variant: "lighter", color: "yellow", class: { root: "bg-away-lighter text-away" } },
		{ variant: "lighter", color: "purple", class: { root: "bg-feature-lighter text-feature" } },
		{ variant: "lighter", color: "sky", class: { root: "bg-verified-lighter text-verified" } },
		{
			variant: "lighter",
			color: "pink",
			class: { root: "bg-highlighted-lighter text-highlighted" },
		},
		{ variant: "lighter", color: "teal", class: { root: "bg-stable-lighter text-stable" } },
		//#endregion

		//#region variant=lighter
		{ bordered: true, color: "gray", class: { root: "border-faded/35" } },
		{ bordered: true, color: "blue", class: { root: "border-info/35" } },
		{ bordered: true, color: "orange", class: { root: "border-warning/35" } },
		{ bordered: true, color: "red", class: { root: "border-error/35" } },
		{ bordered: true, color: "green", class: { root: "border-success/35" } },
		{ bordered: true, color: "yellow", class: { root: "border-away/35" } },
		{ bordered: true, color: "purple", class: { root: "border-feature/35" } },
		{ bordered: true, color: "sky", class: { root: "border-verified/35" } },
		{ bordered: true, color: "pink", class: { root: "border-highlighted/35" } },
		{ bordered: true, color: "teal", class: { root: "border-stable/35" } },
		//#endregion

		//#region variant=fancy
		{
			variant: "fancy",
			color: "gray",
			class: { root: "border-faded-light bg-faded-lighter fill-faded/60 text-faded" },
		},
		{
			variant: "fancy",
			color: "blue",
			class: { root: "border-info-light bg-info-lighter fill-info/60 text-info" },
		},
		{
			variant: "fancy",
			color: "orange",
			class: { root: "border-warning-light bg-warning-lighter fill-warning/60 text-warning" },
		},
		{
			variant: "fancy",
			color: "red",
			class: { root: "border-error-light bg-error-lighter fill-error/60 text-error" },
		},
		{
			variant: "fancy",
			color: "green",
			class: { root: "border-success-light bg-success-lighter fill-success/60 text-success" },
		},
		{
			variant: "fancy",
			color: "yellow",
			class: { root: "border-away-light bg-away-lighter fill-away/60 text-away" },
		},
		{
			variant: "fancy",
			color: "purple",
			class: { root: "border-feature-light bg-feature-lighter fill-feature/60 text-feature" },
		},
		{
			variant: "fancy",
			color: "sky",
			class: { root: "border-verified-light bg-verified-lighter fill-verified/60 text-verified" },
		},
		{
			variant: "fancy",
			color: "pink",
			class: {
				root: "border-highlighted-light bg-highlighted-lighter fill-highlighted/60 text-highlighted",
			},
		},
		{
			variant: "fancy",
			color: "teal",
			class: { root: "border-stable-light bg-stable-lighter fill-stable/60 text-stable" },
		},
		//#endregion

		//#region variant=stroke
		{ variant: "stroke", color: "gray", class: { root: "text-faded" } },
		{ variant: "stroke", color: "blue", class: { root: "bg-info-lighter text-info" } },
		{ variant: "stroke", color: "orange", class: { root: "text-warning" } },
		{ variant: "stroke", color: "red", class: { root: "text-error" } },
		{ variant: "stroke", color: "green", class: { root: "text-success" } },
		{ variant: "stroke", color: "yellow", class: { root: "text-away" } },
		{ variant: "stroke", color: "purple", class: { root: "text-feature" } },
		{ variant: "stroke", color: "sky", class: { root: "text-verified" } },
		{ variant: "stroke", color: "pink", class: { root: "text-highlighted" } },
		{ variant: "stroke", color: "teal", class: { root: "text-stable" } },
		//#endregion

		//#region square
		{ size: "small", square: true, class: { root: "min-w-4 px-1" } },
		{ size: "medium", square: true, class: { root: "min-w-5 px-1" } },
		//#endregion

		//#region disabled
		{
			disabled: true,
			variant: ["stroke", "filled", "light", "lighter"],
			color: ["red", "gray", "blue", "orange", "green", "yellow", "purple", "sky", "pink", "teal"],
			class: {
				root: [
					"ring-1 ring-neutral-200 ring-inset dark:ring-neutral-700",
					"bg-transparent text-neutral-300 dark:text-neutral-600",
				],
			},
		},
		//#endregion
	],
	defaultVariants: { variant: "filled", size: "medium", color: "gray" },
});

type BadgeSharedProps = VariantProps<typeof badgeVariants>;

type BadgeRootProps = Omit<React.ComponentPropsWithoutRef<"div">, "color"> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
		ref?: React.Ref<HTMLDivElement>;
	};

function BadgeRoot({
	asChild,
	size,
	variant,
	color,
	disabled,
	square,
	children,
	className,
	bordered,
	ref,
	...rest
}: BadgeRootProps) {
	const uniqueId = React.useId();
	const { root } = badgeVariants({ size, variant, color, disabled, square, bordered });

	const sharedProps: BadgeSharedProps = {
		size,
		variant,
		color,
	};

	const extendedChildren = recursiveCloneChildren(
		children as React.ReactElement[],
		sharedProps,
		[BADGE_ICON_NAME, BADGE_DOT_NAME],
		uniqueId,
		asChild,
	);

	const rootClassName = root({ class: className });
	const fancyCorners =
		variant === "fancy" ? (
			<>
				<svg
					width="5"
					height="5"
					viewBox="0 0 5 5"
					className="absolute top-[-2.5px] left-[-2.5px] fill-inherit"
				>
					<title>Top-left</title>
					<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
				</svg>
				<svg
					width="5"
					height="5"
					viewBox="0 0 5 5"
					className="absolute top-[-2.5px] right-[-2.5px] fill-inherit"
				>
					<title>Top-right</title>
					<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
				</svg>
				<svg
					width="5"
					height="5"
					viewBox="0 0 5 5"
					className="absolute bottom-[-2.5px] left-[-2.5px] fill-inherit"
				>
					<title>Bottom-left</title>
					<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
				</svg>
				<svg
					width="5"
					height="5"
					viewBox="0 0 5 5"
					className="absolute right-[-2.5px] bottom-[-2.5px] fill-inherit"
				>
					<title>Bottom-right</title>
					<path d="M2 0h1v2h2v1h-2v2h-1v-2h-2v-1h2z" />
				</svg>
			</>
		) : null;

	if (asChild) {
		const slotProps = rest as React.ComponentPropsWithoutRef<typeof Slot.Root>;

		return (
			<Slot.Root className={rootClassName} {...slotProps}>
				{extendedChildren}
				{fancyCorners}
			</Slot.Root>
		);
	}

	return (
		<div ref={ref} className={rootClassName} {...rest}>
			{extendedChildren}
			{fancyCorners}
		</div>
	);
}

BadgeRoot.displayName = BADGE_ROOT_NAME;

function BadgeIcon<T extends React.ElementType>({
	className,
	size,
	variant,
	color,
	as,
	...rest
}: PolymorphicComponentProps<T, BadgeSharedProps>) {
	const Component = as || "div";
	const { icon } = badgeVariants({ size, variant, color });

	return <Component className={icon({ class: className })} {...rest} />;
}
BadgeIcon.displayName = BADGE_ICON_NAME;

type BadgeDotProps = BadgeSharedProps & Omit<React.HTMLAttributes<HTMLDivElement>, "color">;

function BadgeDot({ size, variant, color, className, ...rest }: BadgeDotProps) {
	const { dot } = badgeVariants({ size, variant, color });

	return <div className={dot({ class: className })} {...rest} />;
}
BadgeDot.displayName = BADGE_DOT_NAME;

export { BadgeDot, BadgeIcon, BadgeRoot as Badge, type BadgeSharedProps };
