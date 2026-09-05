"use client";

import type { ReactNode } from "react";
import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { MultiSelect, type MultiSelectProps } from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

export type RHFMultiSelectProps<T extends FieldValues = FieldValues> = Omit<
	MultiSelectProps,
	"value" | "onValueChange"
> & {
	name: Path<T>;
	control: Control<T>;
	label?: ReactNode;
	description?: ReactNode;
	required?: boolean;
	fieldSlot?: {
		field?: React.ComponentProps<typeof Field>;
		fieldLabel?: React.ComponentProps<typeof FieldLabel>;
		fieldDescription?: React.ComponentProps<typeof FieldDescription>;
		fieldError?: React.ComponentProps<typeof FieldError>;
	};
};

export function RHFMultiSelect<T extends FieldValues = FieldValues>({
	name,
	control,
	label,
	description,
	required,
	options,
	groups,
	fieldSlot,
	className,
	triggerClassName,
	...rest
}: RHFMultiSelectProps<T>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController({
		name,
		control,
		defaultValue: [] as never,
	});

	const raw = field.value;
	const value: string[] = Array.isArray(raw) ? raw.map(String) : [];

	return (
		<Field data-invalid={invalid} {...fieldSlot?.field}>
			{label ? (
				<FieldLabel aria-required={required} {...fieldSlot?.fieldLabel}>
					{label}
				</FieldLabel>
			) : null}
			<MultiSelect
				value={value}
				onValueChange={field.onChange}
				options={options}
				groups={groups}
				aria-invalid={invalid || undefined}
				className={cn(className)}
				triggerClassName={triggerClassName}
				{...rest}
			/>
			{description ? (
				<FieldDescription {...fieldSlot?.fieldDescription}>{description}</FieldDescription>
			) : null}
			{invalid ? <FieldError errors={[error]} {...fieldSlot?.fieldError} /> : null}
		</Field>
	);
}
