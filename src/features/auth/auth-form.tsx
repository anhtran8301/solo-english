"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "./api";
import { authQueryKey } from "./use-auth";
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
	const [error, setError] = useState("");
	const router = useRouter(),
		client = useQueryClient();
	const mutation = useMutation({
		mutationFn: (input: { name: string; email: string; password: string }) =>
			mode === "login" ? authApi.login(input) : authApi.signup(input),
		onSuccess: async (user) => {
			await client.cancelQueries();
			client.clear();
			client.setQueryData(authQueryKey, user);
			router.replace("/dashboard");
		},
		onError: (e) => setError(e.message),
	});
	function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError("");
		const data = new FormData(e.currentTarget);
		mutation.mutate({
			name: String(data.get("name") || "").trim(),
			email: String(data.get("email")).trim().toLowerCase(),
			password: String(data.get("password")),
		});
	}
	return (
		<div className="auth-layout">
			<div className="auth-intro">
				<p className="caption">MỘT CHÚT MỖI NGÀY</p>
				<h1>
					{mode === "login" ? "Chào bạn,\nmừng trở lại." : "Hành trình của bạn\nbắt đầu ở đây."}
				</h1>
				<p>
					{mode === "login"
						? "Tiếp tục bài học, ôn lại điều còn quên và ghi nhận những bước tiến nhỏ."
						: "Tạo bài học của riêng mình và xây dựng thói quen nhớ tiếng Anh lâu hơn."}
				</p>
			</div>
			<form onSubmit={submit} className="auth-form panel stack">
				<h2>{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h2>
				{mode === "signup" ? (
					<label>
						Họ và tên
						<Input name="name" required maxLength={100} autoComplete="name" />
					</label>
				) : null}
				<label>
					Email
					<Input name="email" type="email" required autoComplete="email" spellCheck={false} />
				</label>
				<label>
					Mật khẩu
					<Input
						name="password"
						type="password"
						required
						minLength={mode === "signup" ? 8 : 1}
						autoComplete={mode === "signup" ? "new-password" : "current-password"}
					/>
					{mode === "signup" ? <small>Tối thiểu 8 ký tự.</small> : null}
				</label>
				{error ? (
					<p role="alert" className="error-text">
						{error}
					</p>
				) : null}
				<Button type="submit" size="lg" disabled={mutation.isPending}>
					{mutation.isPending ? "Đang xử lý…" : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
					<ArrowRight />
				</Button>
				<p className="muted">
					{mode === "login" ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
					<Link className="text-link" href={mode === "login" ? "/register" : "/login"}>
						{mode === "login" ? "Đăng ký" : "Đăng nhập"}
					</Link>
				</p>
			</form>
		</div>
	);
}
