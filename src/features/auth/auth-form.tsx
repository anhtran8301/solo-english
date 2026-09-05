"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "./api";
import { loginSchema, signupSchema } from "./schema";
import { authQueryKey } from "./use-auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
	const [error, setError] = useState("");
	const router = useRouter();
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (input: { name?: string; email: string; password: string }) =>
			mode === "login"
				? authApi.login({ email: input.email, password: input.password })
				: authApi.signup({ name: input.name ?? "", email: input.email, password: input.password }),
		onSuccess: (user) => {
			queryClient.setQueryData(authQueryKey, user);
			router.replace("/account");
		},
		onError: (cause) => setError(cause.message),
	});

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		const values = Object.fromEntries(new FormData(event.currentTarget));
		const input = {
			name: String(values.name ?? ""),
			email: String(values.email),
			password: String(values.password),
		};
		const parsed = (mode === "login" ? loginSchema : signupSchema).safeParse(input);
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Invalid form data");
			return;
		}
		mutation.mutate(mode === "login" ? { email: input.email, password: input.password } : input);
	}

	return (
		<form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6">
			<h1 className="font-semibold text-2xl">{mode === "login" ? "Sign in" : "Create account"}</h1>
			{mode === "signup" && <Input name="name" placeholder="Name" required />}
			<Input name="email" type="email" placeholder="Email" required />
			<Input
				name="password"
				type="password"
				placeholder="Password"
				minLength={mode === "signup" ? 8 : 1}
				required
			/>
			{error && (
				<p role="alert" className="text-destructive text-sm">
					{error}
				</p>
			)}
			<Button className="w-full" disabled={mutation.isPending}>
				{mutation.isPending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
			</Button>
			<p className="text-center text-muted-foreground text-sm">
				{mode === "login" ? "New here? " : "Already registered? "}
				<Link
					className="text-foreground underline"
					href={mode === "login" ? "/register" : "/login"}
				>
					{mode === "login" ? "Create an account" : "Sign in"}
				</Link>
			</p>
		</form>
	);
}
