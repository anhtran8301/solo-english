import {
	createLoader,
	createSearchParamsCache,
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

export const defaultSearchParams = {
	page: parseAsInteger.withDefault(1),
	limit: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	sort_order: parseAsStringLiteral(["DESC", "ASC"] as const)
		.withDefault("DESC")
		.withOptions({ clearOnDefault: false }),
	sort_by: parseAsString.withDefault("created_at").withOptions({ clearOnDefault: false }),
};

export const loadDefaultSearchParams = createLoader(defaultSearchParams);
export const defaultSearchParamsCache = createSearchParamsCache(defaultSearchParams);
