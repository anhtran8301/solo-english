import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type Option = {
	value: string | number;
	labelText?: string;
	label: React.ReactNode;
	props?: Partial<React.ComponentProps<typeof SelectItem>>;
};

export type RHFSelectProps<T extends FieldValues = FieldValues> = {
	type?: "string" | "number";
	options: Option[];
	//
	onChange?: (value: string | number | undefined) => void;
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
	selectSlot?: {
		root?: React.ComponentProps<typeof Select>;
		trigger?: React.ComponentProps<typeof SelectTrigger>;
		value?: React.ComponentProps<typeof SelectValue>;
		content?: React.ComponentProps<typeof SelectContent>;
		item?: Partial<React.ComponentProps<typeof SelectItem>>;
	};
};

export function RHFSelect<T extends FieldValues = FieldValues>({
	type = "string",
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
	selectSlot,
}: RHFSelectProps<T>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController({ name, control });

	const selectedOption = options.find((option) => option.value === field.value);

	return (
		<Field data-invalid={invalid} {...slot?.field}>
			{label && (
				<FieldLabel aria-required={required} {...slot?.fieldLabel}>
					{label}
				</FieldLabel>
			)}

			<Select
				name={field.name}
				value={field.value?.toString() || ""}
				onValueChange={(e) => {
					field.onChange(type === "number" ? Number(e) : e);
					onChange?.(type === "number" ? Number(e) : e);
				}}
				disabled={disabled}
				{...selectSlot?.root}
			>
				<SelectTrigger
					id={field.name}
					aria-invalid={invalid}
					disabled={disabled}
					className="aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
					{...selectSlot?.trigger}
				>
					<SelectValue data-data placeholder={placeholder} {...selectSlot?.value}>
						{selectedOption?.labelText ?? selectedOption?.label ?? placeholder}
					</SelectValue>
				</SelectTrigger>
				<SelectContent position="item-aligned" {...selectSlot?.content}>
					{options.map((e) => (
						<SelectItem key={e.value} value={e.value.toString()} {...selectSlot?.item} {...e.props}>
							{e.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{description && (
				<FieldDescription {...slot?.fieldDescription}>{description}</FieldDescription>
			)}
			{invalid && <FieldError errors={[error]} {...slot?.fieldError} />}
		</Field>
	);
}
