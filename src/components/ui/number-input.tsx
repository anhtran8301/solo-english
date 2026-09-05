import { forwardRef, useCallback, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NumericFormat, type NumericFormatProps } from "react-number-format";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface NumberInputProps extends Omit<NumericFormatProps, "value" | "onValueChange"> {
	stepper?: number;
	thousandSeparator?: string;
	placeholder?: string;
	defaultValue?: number;
	min?: number;
	max?: number;
	value?: number;
	suffix?: string;
	prefix?: string;
	onValueChange?: (value: number | undefined) => void;
	fixedDecimalScale?: boolean;
	decimalScale?: number;
	//
	hiddenButtons?: boolean;
	currency?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
	(
		{
			stepper,
			thousandSeparator,
			placeholder,
			defaultValue,
			min = -Infinity,
			max = Infinity,
			onValueChange,
			fixedDecimalScale = false,
			decimalScale = 0,
			suffix,
			prefix,
			value: controlledValue,
			hiddenButtons = false,
			currency = false,
			disabled,
			className,
			onBlur,
			...props
		},
		ref,
	) => {
		const internalRef = useRef<HTMLInputElement>(null);

		useEffect(() => {
			if (!ref) return;
			if (typeof ref === "function") {
				ref(internalRef.current);
			} else {
				(ref as React.RefObject<HTMLInputElement | null>).current = internalRef.current;
			}
		}, [ref]);

		const handleIncrement = useCallback(() => {
			if (controlledValue === undefined) return;
			onValueChange?.(Math.min(controlledValue + (stepper ?? 1), max));
		}, [stepper, max, controlledValue, onValueChange]);

		const handleDecrement = useCallback(() => {
			if (controlledValue === undefined) return;
			onValueChange?.(Math.max(controlledValue - (stepper ?? 1), min));
		}, [stepper, min, controlledValue, onValueChange]);

		useEffect(() => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (document.activeElement === internalRef?.current) {
					if (e.key === "ArrowUp") {
						handleIncrement();
					} else if (e.key === "ArrowDown") {
						handleDecrement();
					}
				}
			};

			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, [handleIncrement, handleDecrement]);

		const handleChange = (values: { floatValue: number | undefined }) => {
			onValueChange?.(values.floatValue);
		};

		const handleBlur = () => {
			if (controlledValue === undefined) return;

			let next = controlledValue;

			if (next < min) next = min;
			if (next > max) next = max;

			if (next !== controlledValue) {
				onValueChange?.(next);
			}
		};

		const input = (
			<NumericFormat
				value={controlledValue ?? ""}
				onValueChange={handleChange}
				thousandSeparator={thousandSeparator}
				decimalScale={decimalScale}
				fixedDecimalScale={fixedDecimalScale}
				allowNegative={min < 0}
				onBlur={(e) => {
					handleBlur();
					onBlur?.(e);
				}}
				max={max}
				min={min}
				suffix={suffix}
				prefix={prefix}
				customInput={Input}
				placeholder={placeholder}
				disabled={disabled}
				className={cn(
					"relative [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
					className,
				)}
				getInputRef={internalRef}
				{...(currency && { decimalSeparator: ",", thousandSeparator: "." })}
				{...props}
			/>
		);

		if (hiddenButtons) return input;

		return (
			<ButtonGroup aria-invalid>
				{input}
				<div className="flex flex-col">
					<Button
						variant="outline"
						size="icon"
						aria-label="Increase value"
						className="flex-1 rounded-l-none rounded-br-none border-b border-l-0 px-2 before:shadow-none! focus-visible:relative"
						onClick={handleIncrement}
						tabIndex={-1}
						disabled={controlledValue === max || disabled}
					>
						<ChevronUp className="size-3.5" />
					</Button>
					<Button
						aria-label="Decrease value"
						size="icon"
						className="flex-1 rounded-l-none rounded-tr-none border-t-0 border-l-0 px-2 before:shadow-none! focus-visible:relative"
						variant="outline"
						onClick={handleDecrement}
						tabIndex={-1}
						disabled={controlledValue === min || disabled}
					>
						<ChevronDown className="size-3.5" />
					</Button>
				</div>
			</ButtonGroup>
		);
	},
);
