"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "./use-auth";

export function AuthGuard({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!auth.loading && !auth.authenticated) router.replace("/login");
	}, [auth.authenticated, auth.loading, router]);
	return auth.authenticated ? children : <p className="text-muted-foreground text-sm">Loading…</p>;
}

export function GuestGuard({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const router = useRouter();
	useEffect(() => {
		if (!auth.loading && auth.authenticated) router.replace("/account");
	}, [auth.authenticated, auth.loading, router]);
	return !auth.authenticated ? children : null;
}
