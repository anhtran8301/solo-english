import * as React from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createTV } from "tailwind-variants";

export type { ClassValue, VariantProps } from "tailwind-variants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const tv = createTV({ twMerge: true });

/**
 * Recursively clones React children, adding additional props to components with matched display names.
 *
 * @param children - The node(s) to be cloned.
 * @param additionalProps - The props to add to the matched components.
 * @param displayNames - An array of display names to match components against.
 * @param uniqueId - A unique ID prefix from the parent component to generate stable keys.
 * @param asChild - Indicates whether the parent component uses the Slot component.
 *
 * @returns The cloned node(s) with the additional props applied to the matched components.
 */
export function recursiveCloneChildren(
	children: React.ReactNode,
	additionalProps: any,
	displayNames: string[],
	uniqueId: string,
	asChild?: boolean,
): React.ReactNode | React.ReactNode[] {
	const mappedChildren = React.Children.map(children, (child: React.ReactNode, index) => {
		if (!React.isValidElement(child)) {
			return child;
		}

		const displayName = (child.type as React.ComponentType)?.displayName || "";
		const newProps = displayNames.includes(displayName) ? additionalProps : {};

		const childProps = (child as React.ReactElement<any>).props;

		return React.cloneElement(
			child,
			{
				...newProps,
				key: `${uniqueId}-${
					// biome-ignore lint/suspicious/noArrayIndexKey: <>
					index
				}`,
			},
			recursiveCloneChildren(
				childProps?.children,
				additionalProps,
				displayNames,
				uniqueId,
				childProps?.asChild,
			),
		);
	});

	return asChild ? mappedChildren?.[0] : mappedChildren;
}

type AsProp<T extends React.ElementType> = {
	as?: T;
};

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P);

type PolymorphicComponentProp<
	T extends React.ElementType,
	Props = Record<never, never>,
> = React.PropsWithChildren<Props & AsProp<T>> &
	Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;

export type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"];

type PolymorphicComponentPropWithRef<
	T extends React.ElementType,
	Props = Record<never, never>,
> = PolymorphicComponentProp<T, Props> & {
	ref?: PolymorphicRef<T>;
};

export type PolymorphicComponentPropsWithRef<
	T extends React.ElementType,
	P = Record<never, never>,
> = PolymorphicComponentPropWithRef<T, P>;

export type PolymorphicComponentProps<
	T extends React.ElementType,
	P = Record<never, never>,
> = PolymorphicComponentProp<T, P>;

export type PolymorphicComponent<P> = <T extends React.ElementType>(
	props: PolymorphicComponentPropsWithRef<T, P>,
) => React.ReactNode;
