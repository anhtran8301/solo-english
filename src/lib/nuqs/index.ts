import type { SortingState, Updater } from "@tanstack/react-table";
import {
	createParser,
	parseAsIndex,
	parseAsInteger,
	parseAsString,
	type UrlKeys,
	type UseQueryStatesOptions,
	useQueryStates,
} from "nuqs";

// Pagination
export const paginationParsers = {
	pageIndex: parseAsIndex.withDefault(0),
	pageSize: parseAsInteger.withDefault(10),
};

export const paginationUrlKeys: UrlKeys<typeof paginationParsers> = {
	pageIndex: "page",
	pageSize: "limit",
};

export function usePaginationSearchParams(options?: Omit<UseQueryStatesOptions<any>, "urlKeys">) {
	return useQueryStates(paginationParsers, {
		...options,
		urlKeys: paginationUrlKeys,
	});
}

// Sort server
export const sortingParsers = {
	id: parseAsString.withDefault("created_at").withOptions({ clearOnDefault: false }),
	desc: createParser<boolean>({
		parse: (value) => (value !== "" ? value.toUpperCase() === "DESC" : null),
		serialize: (value) => (value ? "DESC" : "ASC"),
	})
		.withDefault(true)
		.withOptions({ clearOnDefault: false }),
};

export const sortingUrlKeys = {
	id: "sort_by",
	desc: "sort_order",
};

export function useSortingSearchParams(options?: Omit<UseQueryStatesOptions<any>, "urlKeys">) {
	return useQueryStates(sortingParsers, {
		clearOnDefault: false,
		...options,
		urlKeys: sortingUrlKeys,
	});
}

export function handleSorting(
	sorting: ReturnType<typeof useSortingSearchParams>[0],
	onSortingChange: ReturnType<typeof useSortingSearchParams>[1],
) {
	return (updater: Updater<SortingState>) => {
		const sortState = typeof updater === "function" ? updater([sorting]) : updater;
		onSortingChange(sortState?.[0] ?? null);
	};
}
