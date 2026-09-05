import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { NumberInput, type NumberInputProps } from "@/components/ui/number-input";

export type RHFNumberFieldProps<T extends FieldValues = FieldValues> = Omit<
	NumberInputProps,
	"ref"
> & {
	name: Path<T>;
	control: Control<T>;
	required?: boolean;
	label?: React.ReactNode;
	description?: React.ReactNode;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	fieldSlot?: {
		field?: React.ComponentProps<typeof Field>;
		label?: React.ComponentProps<typeof FieldLabel>;
		description?: React.ComponentProps<typeof FieldDescription>;
		error?: React.ComponentProps<typeof FieldError>;
	};
};

export function RHFNumberField<T extends FieldValues = FieldValues>({
	name,
	control,
	label,
	required,
	description,
	prefix,
	suffix,
	fieldSlot: slot,
	...props
}: RHFNumberFieldProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field data-invalid={fieldState.invalid} {...slot?.field}>
			{label && (
				<FieldLabel htmlFor={field.name} aria-required={required} {...slot?.label}>
					{label}
				</FieldLabel>
			)}

			<NumberInput
				value={(field.value ?? undefined) as number | undefined}
				onBlur={field.onBlur}
				onValueChange={(value) => field.onChange(value ?? null)}
				disabled={field.disabled || props.disabled}
				id={field.name}
				aria-invalid={fieldState.invalid}
				prefix={prefix}
				suffix={suffix}
				{...props}
			/>

			{description && <FieldDescription {...slot?.description}>{description}</FieldDescription>}
			{fieldState.invalid && <FieldError errors={[fieldState.error]} {...slot?.error} />}
		</Field>
	);
}
