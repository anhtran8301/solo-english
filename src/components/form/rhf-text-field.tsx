import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";

export type RHFTextFieldProps<T extends FieldValues = FieldValues> = Omit<
	React.ComponentProps<typeof InputGroupInput>,
	"prefix"
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
		fieldLabel?: React.ComponentProps<typeof FieldLabel>;
		fieldDescription?: React.ComponentProps<typeof FieldDescription>;
		fieldError?: React.ComponentProps<typeof FieldError>;
	};
	inputGroupSlot?: {
		inputGroup?: React.ComponentProps<typeof InputGroup>;
	};
};

export function RHFTextField<T extends FieldValues = FieldValues>({
	name,
	control,
	label,
	description,
	required,
	prefix,
	suffix,
	fieldSlot: slot,
	type,
	inputGroupSlot,
	...props
}: RHFTextFieldProps<T>) {
	const [isVisible, setIsVisible] = useState(false);

	const isPassword = type === "password";

	const toggleVisibility = () => setIsVisible((prevState) => !prevState);

	const {
		field,
		fieldState: { invalid, error },
	} = useController({ name, control });

	return (
		<Field data-invalid={invalid} {...slot?.field}>
			{label && (
				<FieldLabel htmlFor={field.name} aria-required={required} {...slot?.fieldLabel}>
					{label}
				</FieldLabel>
			)}

			<InputGroup {...inputGroupSlot?.inputGroup}>
				<InputGroupInput
					{...field}
					id={field.name}
					aria-invalid={invalid}
					type={isPassword ? (isVisible ? "text" : "password") : type}
					autoComplete="off"
					autoCapitalize="false"
					autoCorrect="false"
					spellCheck="false"
					{...props}
				/>
				{prefix && <InputGroupAddon align="inline-start">{prefix}</InputGroupAddon>}
				{suffix && <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>}

				{isPassword && (
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							variant="ghost"
							size="icon-sm"
							className="rounded-full"
							onClick={toggleVisibility}
						>
							<span className="sr-only">{isVisible ? "Hide password" : "Show password"}</span>
							{isVisible ? <EyeOffIcon /> : <EyeIcon />}
						</InputGroupButton>
					</InputGroupAddon>
				)}
			</InputGroup>

			{description && (
				<FieldDescription {...slot?.fieldDescription}>{description}</FieldDescription>
			)}
			{invalid && <FieldError errors={[error]} {...slot?.fieldError} />}
		</Field>
	);
}
