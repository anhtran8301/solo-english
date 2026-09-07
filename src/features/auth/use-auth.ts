"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "./api";
export const authQueryKey = ["auth", "me"] as const;
export function useAuth() {
	const client = useQueryClient();
	const query = useQuery({ queryKey: authQueryKey, queryFn: authApi.me, retry: false });
	return {
		user: query.data,
		loading: query.isLoading,
		error: query.error,
		authenticated: Boolean(query.data),
		refetch: query.refetch,
		clear: async () => {
			await client.cancelQueries();
			client.clear();
			client.setQueryData(authQueryKey, null);
		},
	};
}
