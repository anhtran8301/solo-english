import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "../ui/field";

export type RHFCheckboxProps<T extends FieldValues = FieldValues> = React.ComponentProps<
	typeof Checkbox
> & {
	name: Path<T>;
	control: Control<T>;
	legend?: React.ReactNode;
	description?: string;
	required?: boolean;
	label?: React.ReactNode;
	labelDescription?: React.ReactNode;
	fieldSlot?: {
		set?: React.ComponentProps<typeof FieldSet>;
		legend?: React.ComponentProps<typeof FieldLegend>;
		root?: React.ComponentProps<typeof Field>;
		label?: React.ComponentProps<typeof FieldLabel>;
		description?: React.ComponentProps<typeof FieldDescription>;
		error?: React.ComponentProps<typeof FieldError>;
	};
};

export function RHFCheckbox<T extends FieldValues = FieldValues>({
	name,
	control,
	legend,
	label,
	labelDescription,
	required,
	description,
	fieldSlot,
	...props
}: RHFCheckboxProps<T>) {
	const { field, fieldState } = useController({ name, control });

	return (
		<FieldSet data-invalid={fieldState.invalid} {...fieldSlot?.set}>
			{legend && (
				<FieldLegend variant="label" {...fieldSlot?.legend}>
					{legend} {required && <span className="text-destructive">*</span>}
				</FieldLegend>
			)}
			{description && (
				<FieldDescription {...fieldSlot?.description}>{description}</FieldDescription>
			)}
			<FieldGroup data-slot="checkbox-group">
				<Field orientation="horizontal" {...fieldSlot?.root}>
					<Checkbox
						id={field.name}
						name={field.name}
						checked={field.value}
						onCheckedChange={field.onChange}
						{...props}
					/>
					<FieldContent>
						{label && (
							<FieldLabel
								htmlFor={field.name}
								{...fieldSlot?.label}
								className={cn(!labelDescription && "font-normal", fieldSlot?.label?.className)}
							>
								{label}
							</FieldLabel>
						)}
						{labelDescription && (
							<FieldDescription {...fieldSlot?.description}>{labelDescription}</FieldDescription>
						)}
					</FieldContent>
				</Field>
			</FieldGroup>

			{fieldState.invalid && <FieldError errors={[fieldState.error]} {...fieldSlot?.error} />}
		</FieldSet>
	);
}
