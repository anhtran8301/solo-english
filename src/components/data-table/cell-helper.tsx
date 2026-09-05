"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { CellContext } from "@tanstack/react-table";
import { CheckCircleIcon, CircleXIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { fCurrency, fNumber } from "@/utils/format-number";
import { fDate } from "@/utils/format-time";

export const cellHelpers = {
	date: ({ getValue }: CellContext<any, string>) => (
		<p className="text-right">{getValue() ? fDate(getValue()) : "-"}</p>
	),
	number: ({ getValue }: CellContext<any, number>) => (
		<p className="text-right">{Number.isSafeInteger(getValue()) ? fNumber(getValue()) : "-"}</p>
	),
	currency: ({ getValue }: CellContext<any, number>) => (
		<p className="text-right">{getValue() ? fCurrency(getValue()) : "-"}</p>
	),
	currencyCent: ({ getValue }: CellContext<any, number>) => (
		<p className="text-right">
			{getValue() ? fCurrency(getValue() / 100, { currency: "USD" }) : "-"}
		</p>
	),
	switch: ({ getValue }: CellContext<any, boolean>) => (
		<Switch checked={getValue()} className="cursor-default" />
	),

	boolean: ({ getValue }: CellContext<any, boolean>) => (
		<div className="flex items-center gap-2">
			{getValue() ? (
				<CheckCircleIcon className="mx-auto text-success" />
			) : (
				<CircleXIcon className="mx-auto text-destructive" />
			)}
		</div>
	),

	switchWithAction: (initialValue: boolean, onChange: (value: boolean) => Promise<void>) => {
		const [value, setValue] = useState(initialValue);

		useEffect(() => {
			setValue(initialValue);
		}, [initialValue]);

		const mutation = useMutation({ mutationFn: onChange });

		const onCheckedChange = async (value: boolean) => {
			setValue(value);
			await mutation.mutateAsync(value);
		};

		return (
			<Switch checked={value} onCheckedChange={onCheckedChange} disabled={mutation.isPending} />
		);
	},

	object: ({ getValue }: CellContext<any, any>) => (
		<p>{getValue() ? JSON.stringify(getValue(), null, 2) : "-"}</p>
	),
};
