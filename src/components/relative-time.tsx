"use client";

import { useEffect, useState } from "react";
import { type DatePickerFormat, fDate, fToNow } from "@/utils/format-time";

interface RelativeTimeProps {
	date: DatePickerFormat;
}

export function RelativeTime({ date }: RelativeTimeProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <span>ngày {fDate(date)}</span>;
	}

	return <span>{fToNow(date)} trước</span>;
}
