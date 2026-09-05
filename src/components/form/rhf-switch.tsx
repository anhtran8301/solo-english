import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

export type RHFSwitchProps<T extends FieldValues = FieldValues> = React.ComponentProps<
	typeof Switch
> & {
	name: Path<T>;
	control: Control<T>;
	description?: string;
	required?: boolean;
	label?: React.ReactNode;
	fieldSlot?: {
		root?: React.ComponentProps<typeof Field>;
		label?: React.ComponentProps<typeof FieldLabel>;
		content?: React.ComponentProps<typeof FieldContent>;
		description?: React.ComponentProps<typeof FieldDescription>;
		error?: React.ComponentProps<typeof FieldError>;
	};
};

export function RHFSwitch<T extends FieldValues = FieldValues>({
	name,
	control,
	label,
	required,
	description,
	fieldSlot,
	...props
}: RHFSwitchProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<Field orientation="horizontal" data-invalid={fieldState.invalid} {...fieldSlot?.root}>
			<FieldContent {...fieldSlot?.content}>
				{label && (
					<FieldLabel htmlFor={field.name} aria-required={required} {...fieldSlot?.label}>
						{label}
					</FieldLabel>
				)}
				{description && (
					<FieldDescription {...fieldSlot?.description}>{description}</FieldDescription>
				)}
				{fieldState.invalid && <FieldError errors={[fieldState.error]} {...fieldSlot?.error} />}
			</FieldContent>
			<Switch
				id={field.name}
				name={field.name}
				checked={field.value}
				onCheckedChange={field.onChange}
				aria-invalid={fieldState.invalid}
				{...props}
			/>
		</Field>
	);
}
