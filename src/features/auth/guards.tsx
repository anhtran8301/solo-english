"use client";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "./use-auth";
export function AuthGuard({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!auth.loading && !auth.authenticated && !auth.error) router.replace("/login");
	}, [auth.loading, auth.authenticated, auth.error, router]);
	if (auth.error)
		return (
			<div role="alert" className="panel">
				<p>{auth.error.message}</p>
				<button type="button" className="text-link" onClick={() => auth.refetch()}>
					Thử lại
				</button>
			</div>
		);
	return auth.authenticated ? (
		children
	) : (
		<div className="skeleton-page" aria-label="Đang tải tài khoản…" />
	);
}
export function GuestGuard({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (auth.authenticated) router.replace("/dashboard");
	}, [auth.authenticated, router]);
	return auth.loading ? <div className="skeleton-page" /> : !auth.authenticated ? children : null;
}
