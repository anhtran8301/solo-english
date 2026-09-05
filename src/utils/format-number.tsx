// ----------------------------------------------------------------------

/*
 * Locales code
 * https://gist.github.com/raushankrjha/d1c7e35cf87e69aa8b4208a8171a8416
 */

export type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions;

const DEFAULT_LOCALE = { code: "vi-VN", currency: "VND" };

function processInput(inputValue: InputNumberValue): number | null {
	if (inputValue == null || Number.isNaN(inputValue)) return null;
	return Number(inputValue);
}

// ----------------------------------------------------------------------

export function fNumber(inputValue: InputNumberValue, options?: Options) {
	const locale = DEFAULT_LOCALE;

	const number = processInput(inputValue);
	if (number === null) return "";

	const fm = new Intl.NumberFormat(locale.code, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		...options,
	}).format(number);

	return fm;
}

// ----------------------------------------------------------------------

export function fCurrency(
	inputValue: InputNumberValue,
	options?: Options & { removeSpace?: boolean; code?: string },
) {
	const locale = DEFAULT_LOCALE;
	const { removeSpace = true, ...rest } = options ?? {};

	const number = processInput(inputValue);
	if (number === null) return "";

	const fm = new Intl.NumberFormat(options?.code ?? locale.code, {
		style: "currency",
		currency: locale.currency,
		currencyDisplay: "narrowSymbol",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
		...rest,
	}).format(number);

	return removeSpace ? fm.replace(/\s+(?=[₫$€£¥₹₽])/g, "") : fm;
}

// ----------------------------------------------------------------------

export function fPercent(inputValue: InputNumberValue, options?: Options) {
	const locale = DEFAULT_LOCALE;

	const number = processInput(inputValue);
	if (number === null) return "";

	const fm = new Intl.NumberFormat(locale.code, {
		style: "percent",
		minimumFractionDigits: 0,
		maximumFractionDigits: 1,
		...options,
	}).format(number / 100);

	return fm;
}

// ----------------------------------------------------------------------

export function fShortenNumber(
	inputValue: InputNumberValue,
	options?: Options,
	localeCode?: string,
) {
	const locale = DEFAULT_LOCALE;

	const number = processInput(inputValue);
	if (number === null) return "";

	const fm = new Intl.NumberFormat(localeCode ?? locale.code, {
		notation: "compact",
		maximumFractionDigits: 2,
		...options,
	}).format(number);

	return fm;
}

// ----------------------------------------------------------------------

export function fData(inputValue: InputNumberValue) {
	const number = processInput(inputValue);
	if (number === null || number === 0) return "0 bytes";

	const units = ["bytes", "Kb", "Mb", "Gb", "Tb", "Pb", "Eb", "Zb", "Yb"];
	const decimal = 2;
	const baseValue = 1024;

	const index = Math.floor(Math.log(number) / Math.log(baseValue));
	const fm = `${Number.parseFloat((number / baseValue ** index).toFixed(decimal))} ${units[index]}`;

	return fm;
}

// ----------------------------------------------------------------------

type ShortenOptions = {
	precision?: number;
	trimZero?: boolean;
	space?: boolean;
};

export function fShortenVNCurrency(inputValue: InputNumberValue, options?: ShortenOptions) {
	const number = processInput(inputValue);
	if (number === null) return "";

	const { precision = 1, space = true } = options ?? {};

	const abs = Math.abs(number);
	const sign = number < 0 ? "-" : "";

	const UNITS = [
		{ value: 1_000_000_000, label: "tỷ" },
		{ value: 1_000_000, label: "triệu" },
		{ value: 1_000, label: "nghìn" },
	];

	for (const u of UNITS) {
		if (abs >= u.value) {
			const n = (abs / u.value).toFixed(precision);
			return `${sign}${fNumber(n)}${space ? " " : ""}${u.label}`;
		}
	}

	return sign + fNumber(abs);
}

export function parseVNCurrencyShorten(input: string): number | null {
	if (!input) return null;

	const value = input
		.toLowerCase()
		.replace(/[, ]+/g, "")
		.replace(/vnđ|vnd|đ/g, "");

	const map: Record<string, number> = {
		tỷ: 1_000_000_000,
		ty: 1_000_000_000,
		triệu: 1_000_000,
		trieu: 1_000_000,
		nghìn: 1_000,
		nghin: 1_000,
		k: 1_000,
	};

	const match = value.match(/^(-?\d+(\.\d+)?)([a-zà-ỹ]+)?$/i);
	if (!match) return null;

	const num = Number(match[1]);
	const unit = match[3];

	return unit ? num * (map[unit] ?? 1) : num;
}
