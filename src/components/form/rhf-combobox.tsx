import { useState } from "react";
import { CheckIcon, ChevronsUpDown, Loader2Icon } from "lucide-react";
import { type Control, type FieldValues, type Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../ui/command";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Option = {
	value: string | number;
	labelText?: string;
	label: React.ReactNode;
	keywords?: string[];
	props?: Partial<React.ComponentProps<typeof CommandItem>>;
};
export type RHFComboboxProps<T extends FieldValues = FieldValues> = {
	type?: "string" | "number";
	modal?: boolean;
	loading?: boolean;
	onChange?: (value: string | number | undefined) => void;
	name: Path<T>;
	control: Control<T>;
	options: Option[];
	required?: boolean;
	disabled?: boolean;
	label?: React.ReactNode;
	description?: React.ReactNode;
	placeholder?: string;
	fieldSlot?: {
		field?: React.ComponentProps<typeof Field>;
		fieldLabel?: React.ComponentProps<typeof FieldLabel>;
		fieldDescription?: React.ComponentProps<typeof FieldDescription>;
		fieldError?: React.ComponentProps<typeof FieldError>;
	};
};

export function RHFCombobox<T extends FieldValues = FieldValues>({
	type = "string",
	name,
	control,
	options,
	onChange,
	required,
	disabled,
	loading,
	label,
	description,
	placeholder,
	fieldSlot,
	modal,
}: RHFComboboxProps<T>) {
	const [open, setOpen] = useState(false);
	const {
		field,
		fieldState: { invalid, error },
	} = useController({ name, control });

	const selectedOption = options.find((option) => option.value === field.value);

	return (
		<Field data-invalid={invalid} {...fieldSlot?.field}>
			{label && (
				<FieldLabel aria-required={required} {...fieldSlot?.fieldLabel}>
					{label}
				</FieldLabel>
			)}

			<Popover open={open} modal={modal} onOpenChange={setOpen}>
				<PopoverTrigger asChild disabled={disabled}>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className={cn("justify-between font-normal", !field.value && "text-muted-foreground")}
					>
						{field.value
							? (selectedOption?.labelText ??
								selectedOption?.label ??
								(loading ? (
									<span className="flex items-center gap-2 text-muted-foreground">
										<Loader2Icon className="size-3 animate-spin" />
										Đang tải...
									</span>
								) : (
									<span className="text-muted-foreground">{placeholder}</span>
								)))
							: placeholder}
						<ChevronsUpDown className="opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent fitTrigger className="p-0">
					<Command>
						<CommandInput placeholder={placeholder} className="h-9" />
						<CommandList>
							<CommandEmpty>
								{loading ? (
									<div className="flex items-center justify-center gap-2">
										<Loader2Icon className="size-4 animate-spin" />
										<span>Đang tải...</span>
									</div>
								) : (
									"Không tìm thấy kết quả."
								)}
							</CommandEmpty>
							<CommandGroup>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										value={option.value.toString()}
										keywords={option.keywords}
										onSelect={(currentValue) => {
											// cmdk lowercases the value, so we need to find the original option
											const originalOption = options.find(
												(opt) => opt.value.toString().toLowerCase() === currentValue.toLowerCase(),
											);
											const originalValue = originalOption?.value ?? currentValue;
											field.onChange(type === "number" ? Number(originalValue) : originalValue);
											onChange?.(type === "number" ? Number(originalValue) : originalValue);
											setOpen(false);
										}}
										{...option.props}
									>
										{option.label}
										<CheckIcon
											className={cn(
												"ml-auto",
												field.value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			{description && (
				<FieldDescription {...fieldSlot?.fieldDescription}>{description}</FieldDescription>
			)}
			{invalid && <FieldError errors={[error]} {...fieldSlot?.fieldError} />}
		</Field>
	);
}
