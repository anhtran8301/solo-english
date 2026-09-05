export type ApiResponse<T> = {
	success: true;
	code: number;
	message: string;
	timestamp: string;
	data: T;
};

export type ApiErrorResponse = {
	success: false;
	code: number;
	message: string | string[];
	timestamp: string;
	data: null;
};

export type BaseEntity = {
	id: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
};

export type Entity<T> = {
	[K in keyof T]: T[K];
} & BaseEntity;

export type List<T> = ApiResponse<{
	items: T[];
	meta: {
		has_next_page: boolean;
		has_previous_page: boolean;
		limit: number;
		page: number;
		total: number;
		total_pages: number;
	};
}>;

export type Pagination = {
	total: number;
	page: number;
	limit: number;
};

export type SearchParams = Record<string, any> & {
	page: number;
	limit: number;
	search: string;
	sort_by: string;
	sort_order: "ASC" | "DESC";
};
