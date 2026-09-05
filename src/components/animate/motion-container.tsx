"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import * as motion from "motion/react-client";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { varContainer } from "./variants";

// ----------------------------------------------------------------------

type DivProps = ComponentPropsWithoutRef<"div">;

function stripMotionDivProps(props: Omit<HTMLMotionProps<"div">, "ref" | "children">): DivProps {
	const {
		initial,
		animate,
		exit,
		variants,
		transition,
		style,
		whileHover,
		whileTap,
		whileInView,
		whileFocus,
		whileDrag,
		layout,
		layoutId,
		drag,
		dragConstraints,
		onAnimationStart,
		onAnimationComplete,
		onUpdate,
		onAnimationEnd,
		custom,
		inherit,
		...divProps
	} = props;
	return divProps as DivProps;
}

export type MotionContainerProps = Omit<HTMLMotionProps<"div">, "children"> & {
	animate?: boolean;
	action?: boolean;
	children?: ReactNode;
};

export const MotionContainer = (props: MotionContainerProps) => {
	const { ref, animate, action = false, children, ...other } = props;
	const prefersReducedMotion = usePrefersReducedMotion();

	if (prefersReducedMotion) {
		return (
			<div ref={ref} {...stripMotionDivProps(other)}>
				{children}
			</div>
		);
	}

	return (
		<motion.div
			ref={ref}
			variants={varContainer()}
			initial={action ? false : "initial"}
			animate={action ? (animate ? "animate" : "exit") : "animate"}
			exit={action ? undefined : "exit"}
			{...other}
		>
			{children}
		</motion.div>
	);
};
