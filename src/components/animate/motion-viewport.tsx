"use client";

import type { HTMLProps } from "react";
import type { MotionProps } from "motion/react";
import { motion } from "motion/react";
import { useMediaQuery } from "usehooks-ts";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { varContainer } from "./variants";

// ----------------------------------------------------------------------

export type MotionViewportProps = HTMLProps<HTMLDivElement> &
	MotionProps & {
		disableAnimate?: boolean;
	};

export const MotionViewport = (props: MotionViewportProps) => {
	const { children, ref, viewport, disableAnimate = true, ...other } = props;

	const smDown = useMediaQuery("(max-width: 640px)");
	const prefersReducedMotion = usePrefersReducedMotion();

	const disabled = smDown && disableAnimate && false;

	if (disabled || prefersReducedMotion) {
		return (
			<div ref={ref} {...other}>
				{children}
			</div>
		);
	}

	return (
		<motion.div
			ref={ref}
			initial="initial"
			whileInView="animate"
			variants={varContainer()}
			viewport={{ once: true, amount: 0.3, ...viewport }}
			{...other}
		>
			{children}
		</motion.div>
	);
};
