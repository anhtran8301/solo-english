"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataState, Empty, LessonCard, PageHeading, useData } from "./shared";
import { type Lesson, TYPE_LABELS } from "./types";
export function ExplorePage() {
	const router = useRouter(),
		params = useSearchParams();
	const query = useData<{
		items: Lesson[];
		meta: { page: number; total_pages: number; total: number };
	}>(`public/lessons?${params.toString()}`);
	function filter(key: string, value: string) {
		const next = new URLSearchParams(params);
		next.set(key, value);
		if (key !== "page") next.delete("page");
		router.replace(`/explore?${next}`, { scroll: false });
	}
	return (
		<>
			<PageHeading
				title="Tiếng Anh, từ những điều gần gũi."
				description="Khám phá bài học được chia sẻ. Sao chép về thư viện và biến thành bài học của riêng bạn."
			/>
			<div className="library-toolbar">
				<label className="search-field">
					Tìm bài học
					<Input
						type="search"
						defaultValue={params.get("search") || ""}
						onChange={(e) => filter("search", e.target.value)}
						placeholder="Chào hỏi, công việc, ngữ pháp…"
					/>
				</label>
				<label>
					Loại kiến thức
					<select value={params.get("type") || ""} onChange={(e) => filter("type", e.target.value)}>
						<option value="">Tất cả</option>
						{Object.entries(TYPE_LABELS).map(([key, label]) => (
							<option value={key} key={key}>
								{label}
							</option>
						))}
					</select>
				</label>
			</div>
			<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
				{query.data?.items.length ? (
					<>
						<div className="lesson-grid">
							{query.data.items.map((l) => (
								<div key={l.id}>
									<LessonCard lesson={l} href={`/explore/${l.id}`} />
									<p className="author">Bởi {l.owner?.name}</p>
								</div>
							))}
						</div>
						<nav className="pagination" aria-label="Phân trang">
							<Button
								variant="outline"
								disabled={query.data.meta.page <= 1}
								onClick={() => filter("page", String((query.data?.meta.page || 1) - 1))}
							>
								Trang trước
							</Button>
							<span>
								{query.data.meta.page} / {query.data.meta.total_pages}
							</span>
							<Button
								variant="outline"
								disabled={query.data.meta.page >= query.data.meta.total_pages}
								onClick={() => filter("page", String((query.data?.meta.page || 1) + 1))}
							>
								Trang sau
							</Button>
						</nav>
					</>
				) : (
					<Empty title="Chưa có bài phù hợp">
						<p>Thử từ khóa khác hoặc quay lại khi có bài được chia sẻ.</p>
					</Empty>
				)}
			</DataState>
		</>
	);
}
