import type { Dayjs, OpUnitType } from "dayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/vi";

// ----------------------------------------------------------------------

dayjs.locale("vi");
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// ----------------------------------------------------------------------

export type DatePickerFormat = Dayjs | Date | string | number | null | undefined;

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatPatterns = {
	dateTime: "DD/MM/YYYY, HH:mm A", // 31/12/2024, 23:09 PM
	date: "DD/MM/YYYY", // 31/12/2024
	time: "HH:mm", // 23:09
	paramCase: {
		dateTime: "DD-MM-YYYY h:mm a", // 17-04-2022 12:00 am
		date: "DD-MM-YYYY", // 17-04-2022
	},
};

const isValidDate = (date: DatePickerFormat) =>
	date !== null && date !== undefined && dayjs(date).isValid();

export function years(start?: number, end?: number): number[] {
	const startYear = start || 2020;
	const endYear = end || new Date().getFullYear();
	return Array.from({ length: endYear - startYear + 1 }, (_, i) => endYear - i);
}

// ----------------------------------------------------------------------

export function today(template?: string): string {
	return dayjs(new Date()).startOf("day").format(template);
}

// ----------------------------------------------------------------------

/**
 * @output 23:09 31/12/2024
 */
export function fDateTime(date: DatePickerFormat, template?: string): string {
	if (!isValidDate(date)) {
		return "Invalid date";
	}

	return dayjs(date).format(template ?? formatPatterns.dateTime);
}

// ----------------------------------------------------------------------

/**
 * @output 17/04/2022
 */
export function fDate(date: DatePickerFormat, template?: string): string {
	if (!isValidDate(date)) {
		return "Invalid date";
	}

	return dayjs(date).format(template ?? formatPatterns.date);
}

// ----------------------------------------------------------------------

/**
 * @output 23:09
 */
export function fTime(date: DatePickerFormat, template?: string): string {
	if (!isValidDate(date)) {
		return "Invalid date";
	}

	return dayjs(date).format(template ?? formatPatterns.time);
}

// ----------------------------------------------------------------------

/**
 * @output 1713250100
 */
export function fTimestamp(date: DatePickerFormat): number | "Invalid date" {
	if (!isValidDate(date)) {
		return "Invalid date";
	}

	return dayjs(date).valueOf();
}

// ----------------------------------------------------------------------

/**
 * @output a few seconds, 2 years
 */
export function fToNow(date: DatePickerFormat): string {
	if (!isValidDate(date)) {
		return "Invalid date";
	}

	return dayjs(date).toNow(true);
}

/**
 * Human-readable duration between two dates, e.g. "2 giờ", "3 ngày"
 */
export function fDurationBetween(from: DatePickerFormat, to: DatePickerFormat): string {
	if (!isValidDate(from) || !isValidDate(to)) {
		return "—";
	}

	const diffMs = dayjs(to).diff(dayjs(from));
	if (diffMs < 0) return "—";

	return dayjs.duration(diffMs).humanize();
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */
export function fIsBetween(
	inputDate: DatePickerFormat,
	startDate: DatePickerFormat,
	endDate: DatePickerFormat,
): boolean {
	if (!isValidDate(inputDate) || !isValidDate(startDate) || !isValidDate(endDate)) {
		return false;
	}

	const formattedInputDate = fTimestamp(inputDate);
	const formattedStartDate = fTimestamp(startDate);
	const formattedEndDate = fTimestamp(endDate);

	if (
		formattedInputDate === "Invalid date" ||
		formattedStartDate === "Invalid date" ||
		formattedEndDate === "Invalid date"
	) {
		return false;
	}

	return formattedInputDate >= formattedStartDate && formattedInputDate <= formattedEndDate;
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */
export function fIsAfter(startDate: DatePickerFormat, endDate: DatePickerFormat): boolean {
	if (!isValidDate(startDate) || !isValidDate(endDate)) {
		return false;
	}

	return dayjs(startDate).isAfter(endDate);
}

// ----------------------------------------------------------------------

/**
 * @output boolean
 */
export function fIsSame(
	startDate: DatePickerFormat,
	endDate: DatePickerFormat,
	unitToCompare?: OpUnitType,
): boolean {
	if (!isValidDate(startDate) || !isValidDate(endDate)) {
		return false;
	}

	return dayjs(startDate).isSame(endDate, unitToCompare ?? "year");
}

/**
 * @output
 * Same day: 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same month: 25 - 26 Apr 2024
 * Same year: 25 Apr - 26 May 2024
 */
export function fDateRangeShortLabel(
	startDate: DatePickerFormat,
	endDate: DatePickerFormat,
	initial?: boolean,
): string {
	if (!isValidDate(startDate) || !isValidDate(endDate) || fIsAfter(startDate, endDate)) {
		return "Invalid date";
	}

	let label = `${fDate(startDate)} - ${fDate(endDate)}`;

	if (initial) {
		return label;
	}

	const isSameYear = fIsSame(startDate, endDate, "year");
	const isSameMonth = fIsSame(startDate, endDate, "month");
	const isSameDay = fIsSame(startDate, endDate, "day");

	if (isSameYear && !isSameMonth) {
		label = `${fDate(startDate, "DD/MM")} - ${fDate(endDate)}`;
	} else if (isSameYear && isSameMonth && !isSameDay) {
		label = `${fDate(startDate, "DD")} - ${fDate(endDate)}`;
	} else if (isSameYear && isSameMonth && isSameDay) {
		label = `${fDate(endDate)}`;
	}

	return label;
}

// ----------------------------------------------------------------------

/**
 * @output 2024-05-28T05:55:31+00:00
 */
export type DurationProps = {
	years?: number;
	months?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
};

export function fAdd({
	years = 0,
	months = 0,
	days = 0,
	hours = 0,
	minutes = 0,
	seconds = 0,
	milliseconds = 0,
}: DurationProps) {
	const result = dayjs()
		.add(
			dayjs.duration({
				years,
				months,
				days,
				hours,
				minutes,
				seconds,
				milliseconds,
			}),
		)
		.format();

	return result;
}

/**
 * @output 2024-05-28T05:55:31+00:00
 */
export function fSub({
	years = 0,
	months = 0,
	days = 0,
	hours = 0,
	minutes = 0,
	seconds = 0,
	milliseconds = 0,
}: DurationProps) {
	const result = dayjs()
		.subtract(
			dayjs.duration({
				years,
				months,
				days,
				hours,
				minutes,
				seconds,
				milliseconds,
			}),
		)
		.format();

	return result;
}
