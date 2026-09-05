import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupTextarea } from "@/components/ui/input-group";
import type { Textarea } from "@/components/ui/textarea";

export type RHFTextAreaProps<T extends FieldValues = FieldValues> = React.ComponentProps<
	typeof Textarea
> & {
	name: Path<T>;
	control: Control<T>;
	required?: boolean;
	label?: React.ReactNode;
	description?: React.ReactNode;
	//
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	//
	fieldSlot?: {
		field?: React.ComponentProps<typeof Field>;
		label?: React.ComponentProps<typeof FieldLabel>;
		description?: React.ComponentProps<typeof FieldDescription>;
		error?: React.ComponentProps<typeof FieldError>;
	};
};

export function RHFTextArea<T extends FieldValues = FieldValues>({
	name,
	control,
	required,
	label,
	description,
	prefix,
	suffix,
	fieldSlot: slot,
	...props
}: RHFTextAreaProps<T>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController({ name, control });

	return (
		<Field data-invalid={invalid} {...slot?.field}>
			{label && (
				<FieldLabel aria-required={required} {...slot?.label}>
					{label}
				</FieldLabel>
			)}

			<InputGroup>
				<InputGroupTextarea
					{...field}
					id={field.name}
					aria-invalid={invalid}
					autoComplete="off"
					autoCapitalize="off"
					autoCorrect="off"
					spellCheck="false"
					{...props}
				/>
				{prefix && <InputGroupAddon align="block-start">{prefix}</InputGroupAddon>}
				{suffix && <InputGroupAddon align="block-end">{suffix}</InputGroupAddon>}
			</InputGroup>

			{description && <FieldDescription {...slot?.description}>{description}</FieldDescription>}
			{invalid && <FieldError errors={[error]} {...slot?.error} />}
		</Field>
	);
}
