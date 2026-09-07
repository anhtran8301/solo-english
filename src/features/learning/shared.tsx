"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, BookOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import type { Lesson } from "./types";

export function useData<T>(path: string, enabled = true) {
	return useQuery<T>({ queryKey: ["learning", path], queryFn: () => apiRequest<T>(path), enabled });
}
export function useAction<T = unknown>(
	path: string,
	method = "POST",
	onSuccess?: (data: T) => void,
) {
	const client = useQueryClient();
	return useMutation({
		mutationFn: (body: unknown) =>
			apiRequest<T>(path, {
				method,
				...(body === undefined ? {} : { body: JSON.stringify(body) }),
			}),
		onSuccess: (data) => {
			void client.invalidateQueries({ queryKey: ["learning"] });
			onSuccess?.(data);
		},
	});
}
export function DataState({
	loading,
	error,
	retry,
	children,
}: {
	loading: boolean;
	error?: Error | null;
	retry: () => unknown;
	children: ReactNode;
}) {
	if (loading) return <div className="skeleton-page" aria-label="Đang tải…" />;
	if (error)
		return (
			<div className="panel stack" role="alert">
				<h2>Chưa tải được nội dung</h2>
				<p>{error.message}</p>
				<Button variant="outline" onClick={() => retry()}>
					<RefreshCw />
					Thử lại
				</Button>
			</div>
		);
	return children;
}
export function ErrorText({ error }: { error?: Error | null }) {
	return error ? (
		<p className="error-text" role="alert">
			{error.message}
		</p>
	) : null;
}
export function Empty({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="empty-state">
			<BookOpen size={32} aria-hidden="true" />
			<h2>{title}</h2>
			<div>{children}</div>
		</div>
	);
}
export function PageHeading({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children?: ReactNode;
}) {
	return (
		<header className="page-heading">
			<div>
				<h1>{title}</h1>
				{description ? <p>{description}</p> : null}
			</div>
			{children ? <div className="actions">{children}</div> : null}
		</header>
	);
}
export function LessonCard({ lesson, href }: { lesson: Lesson; href?: string }) {
	return (
		<Link className="lesson-card" href={href || `/lessons/${lesson.id}`}>
			<div className="lesson-icon">
				<BookOpen size={22} aria-hidden="true" />
			</div>
			<span className="caption">
				{lesson.visibility === "DRAFT"
					? "Bản nháp"
					: lesson.visibility === "PUBLIC"
						? "Bài công khai"
						: "Bài cá nhân"}
			</span>
			<h3>{lesson.title}</h3>
			<p>{lesson.description || "Học theo bốn bước, nhớ thêm mỗi ngày."}</p>
			<div className="card-footer">
				<span>{lesson._count?.knowledgeItems ?? lesson.knowledgeItems?.length ?? 0} kiến thức</span>
				<ArrowRight size={18} aria-hidden="true" />
			</div>
		</Link>
	);
}
export function duration(seconds: number) {
	return `${Math.floor(seconds / 60)} phút ${seconds % 60} giây`;
}
export function dateLabel(date: string) {
	return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(date));
}
