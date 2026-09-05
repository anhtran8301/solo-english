"use client";

import { useMemo } from "react";
import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "../ui/combobox";

type Option = {
	value: string;
	label: React.ReactNode;
};

export type RHFComboboxProps<T extends FieldValues = FieldValues> = {
	options: Option[];
	//
	onChange?: (value: Option | null) => void;
	name: Path<T>;
	control: Control<T>;
	required?: boolean;
	disabled?: boolean;
	label?: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;
	//
	fieldSlot?: {
		field?: React.ComponentProps<typeof Field>;
		fieldLabel?: React.ComponentProps<typeof FieldLabel>;
		fieldDescription?: React.ComponentProps<typeof FieldDescription>;
		fieldError?: React.ComponentProps<typeof FieldError>;
	};
	comboboxSlot?: {
		root?: React.ComponentProps<typeof Combobox>;
		trigger?: React.ComponentProps<typeof ComboboxInput>;
		input?: React.ComponentProps<typeof ComboboxInput>;
		content?: React.ComponentProps<typeof ComboboxContent>;
		item?: Partial<React.ComponentProps<typeof ComboboxItem>>;
	};
};

export function RHFCombobox<T extends FieldValues = FieldValues>({
	options,
	disabled,
	placeholder,
	onChange,
	name,
	control,
	label,
	description,
	required,
	fieldSlot: slot,
	comboboxSlot,
}: RHFComboboxProps<T>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController({ name, control });

	const optionsMap = useMemo(() => new Map(options.map((opt) => [opt.value, opt])), [options]);

	const selectedOption = useMemo(
		() => (field.value ? (optionsMap.get(field.value) ?? null) : null),
		[field.value, optionsMap],
	);

	return (
		<Field data-invalid={invalid} {...slot?.field}>
			{label && (
				<FieldLabel aria-required={required} {...slot?.fieldLabel}>
					{label}
				</FieldLabel>
			)}
			<Combobox
				disabled={disabled}
				items={options}
				value={selectedOption}
				multiple={false}
				isItemEqualToValue={(item, value) => (item as Option)?.value === (value as Option)?.value}
				onValueChange={(value) => {
					field.onChange((value as Option)?.value ?? null);
					onChange?.(value as Option);
				}}
				{...comboboxSlot?.root}
			>
				<ComboboxInput
					placeholder={placeholder}
					className={cn(
						invalid && "border-destructive! ring-destructive/20! dark:ring-destructive/40!",
						comboboxSlot?.input?.className,
					)}
					{...comboboxSlot?.input}
				/>
				<ComboboxContent {...comboboxSlot?.content}>
					<ComboboxEmpty>No items found.</ComboboxEmpty>
					<ComboboxList>
						{(item: Option) => (
							<ComboboxItem key={item.value} value={item}>
								{item.label}
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</Combobox>
			{description && (
				<FieldDescription {...slot?.fieldDescription}>{description}</FieldDescription>
			)}
			{invalid && <FieldError errors={[error]} {...slot?.fieldError} />}
		</Field>
	);
}
