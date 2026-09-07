"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Shuffle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataState, Empty, ErrorText, PageHeading, useAction, useData } from "./shared";
import { type LearningSession, type ProgressItem, STATUS_LABELS, TYPE_LABELS } from "./types";

function ReviewItem({ item }: { item: ProgressItem }) {
	const action = useAction(`knowledge-progress/${item.id}`, "PATCH");
	return (
		<div className="review-item">
			<div>
				<strong>{item.term}</strong>
				<p>{item.meaning}</p>
				<span className="caption">{item.lesson.title}</span>
			</div>
			<div className="review-item-stats">
				<span className={`status status-${item.status.toLowerCase()}`}>
					{STATUS_LABELS[item.status]}
				</span>
				<span>
					{item.seen ? `${item.accuracy}% chính xác · ${item.wrong} lần sai` : "Chưa có lượt học"}
				</span>
			</div>
			<Button
				variant="ghost"
				size="icon"
				aria-label={item.saved ? "Bỏ lưu để ôn" : "Lưu để ôn"}
				aria-pressed={item.saved}
				disabled={action.isPending}
				onClick={() => action.mutate({ saved: !item.saved })}
			>
				<Star className={item.saved ? "fill-primary text-primary" : ""} />
			</Button>
			<ErrorText error={action.error} />
		</div>
	);
}
export function ReviewPage({ mistakes = false }: { mistakes?: boolean }) {
	const query = useData<ProgressItem[]>("knowledge-progress"),
		router = useRouter(),
		params = useSearchParams();
	const start = useAction<LearningSession>("learning-sessions", "POST", (s) =>
		router.push(`/learn/${s.id}`),
	);
	const filter = params.get("filter") || (mistakes ? "mistakes" : "review");
	const list = (query.data || []).filter((p) =>
		mistakes
			? ["WEAK", "REVIEWING"].includes(p.status) && p.wrong > 0
			: filter === "all"
				? true
				: p.needsReview,
	);
	return (
		<>
			<PageHeading
				title={mistakes ? "Sai một lần. Nhớ thêm một chút." : "Nhớ lại, để nhớ lâu hơn."}
				description={
					mistakes
						? "Những kiến thức cần luyện thêm, tự động tập hợp từ lịch sử học của bạn."
						: "Một phiên ngắn, tập trung vào những gì bạn cần nhất."
				}
			>
				<Button
					disabled={start.isPending || !list.length}
					onClick={() => start.mutate({ kind: mistakes ? "MISTAKES" : "QUICK" })}
				>
					<RotateCcw />
					{mistakes ? "Luyện từ lỗi sai" : "Ôn nhanh 10 câu"}
				</Button>
			</PageHeading>
			<ErrorText error={start.error} />
			{!mistakes ? (
				<div className="library-toolbar">
					<div className="segmented">
						<button
							type="button"
							className={filter === "review" ? "active" : ""}
							onClick={() => router.replace("/review?filter=review")}
						>
							Cần ôn
						</button>
						<button
							type="button"
							className={filter === "all" ? "active" : ""}
							onClick={() => router.replace("/review?filter=all")}
						>
							Tất cả kiến thức
						</button>
					</div>
					<Button
						variant="outline"
						disabled={start.isPending || !query.data?.some((p) => p.seen)}
						onClick={() => start.mutate({ kind: "RANDOM" })}
					>
						<Shuffle />
						Luyện ngẫu nhiên
					</Button>
				</div>
			) : null}
			<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
				{list.length ? (
					Object.entries(TYPE_LABELS).map(([type, label]) => {
						const items = list.filter((p) => p.type === type);
						return items.length ? (
							<section className="panel" key={type}>
								<h2>
									{label} <small>{items.length}</small>
								</h2>
								{items.map((p) => (
									<ReviewItem key={p.id} item={p} />
								))}
							</section>
						) : null;
					})
				) : (
					<Empty
						title={mistakes ? "Chưa có kiến thức cần luyện từ lỗi sai" : "Chưa có kiến thức cần ôn"}
					>
						<p>Tiếp tục học, hoặc lưu một kiến thức trong danh sách Tất cả để ôn lại.</p>
					</Empty>
				)}
			</DataState>
		</>
	);
}
