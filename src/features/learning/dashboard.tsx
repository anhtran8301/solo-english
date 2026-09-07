"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Clock3, RotateCcw, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { DataState, dateLabel, Empty, ErrorText, PageHeading, useAction, useData } from "./shared";
import type { Dashboard, LearningSession, PageResult } from "./types";

export function DashboardPage() {
	const auth = useAuth(),
		router = useRouter();
	const query = useData<Dashboard>("progress");
	const start = useAction<LearningSession>("learning-sessions", "POST", (s) =>
		router.push(`/learn/${s.id}`),
	);
	const data = query.data;
	return (
		<>
			<PageHeading
				title={`Chào ${auth.user?.name.split(" ").at(-1) || "bạn"}, học một chút nhé.`}
				description="Không cần học thật nhiều. Chỉ cần quay lại mỗi ngày."
			/>
			<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
				{data ? (
					<>
						<div className="dashboard-feature">
							<div>
								<span className="caption">MỖI NGÀY MỘT CHÚT</span>
								<h2>
									{data.continueSession
										? "Tiếp tục từ nơi bạn dừng."
										: "Bài học tiếp theo đang đợi bạn."}
								</h2>
								<p>
									{data.continueSession?.title ||
										"Chọn một bài trong thư viện và bắt đầu hành trình Learn, Use, Recall, Expand."}
								</p>
								<Button asChild size="lg">
									<Link
										href={data.continueSession ? `/learn/${data.continueSession.id}` : "/library"}
									>
										{data.continueSession ? "Học tiếp" : "Mở thư viện"}
										<ArrowRight />
									</Link>
								</Button>
							</div>
							<div className="learning-orbit" aria-hidden="true">
								<div className="orbit-core">
									<BookOpen size={44} strokeWidth={1.2} />
								</div>
								<span>Learn</span>
								<span>Use</span>
								<span>Recall</span>
								<span>Expand</span>
							</div>
						</div>
						<div className="stats-grid">
							<div>
								<Target />
								<strong>{data.today.questions}</strong>
								<span>Câu hỏi hôm nay</span>
							</div>
							<div>
								<Sparkles />
								<strong>{data.today.questions ? `${data.today.accuracy}%` : "-"}</strong>
								<span>Độ chính xác</span>
							</div>
							<div>
								<BookOpen />
								<strong>
									{data.mastered}
									<small> / {data.totalKnowledge}</small>
								</strong>
								<span>Kiến thức đã ghi nhớ</span>
							</div>
							<div>
								<Clock3 />
								<strong>
									{data.streak}
									<small> ngày</small>
								</strong>
								<span>Chuỗi ngày học</span>
							</div>
						</div>
						<div className="dashboard-columns">
							<section className="panel">
								<div className="section-title">
									<h2>Nhớ lại để nhớ lâu</h2>
									<RotateCcw size={22} />
								</div>
								<p className="muted">
									{data.reviewCount
										? `${data.reviewCount} kiến thức đang chờ được ôn lại.`
										: "Kiến thức cần ôn sẽ xuất hiện sau khi bạn học."}
								</p>
								<Button
									variant="outline"
									disabled={start.isPending || !data.reviewCount}
									onClick={() => start.mutate({ kind: "QUICK" })}
								>
									{start.isPending ? "Đang chuẩn bị…" : "Ôn nhanh 10 câu"}
									<ArrowRight />
								</Button>
								<ErrorText error={start.error} />
							</section>
							<section className="panel">
								<div className="section-title">
									<h2>Gần đây bạn đã học</h2>
									<Link className="text-link" href="/progress">
										Xem tất cả
									</Link>
								</div>
								{data.sessions.length ? (
									data.sessions.slice(0, 3).map((s) => (
										<Link key={s.id} href={`/learn/${s.id}`} className="history-row">
											<div>
												<strong>{s.title}</strong>
												<span>
													{dateLabel(s.createdAt)} · {s.answered.length} câu
												</span>
											</div>
											<span>
												{s.completedAt ? `${s.accuracy}%` : "Học tiếp"}
												<ArrowRight size={15} />
											</span>
										</Link>
									))
								) : (
									<p className="muted">
										Chưa có phiên học. Bắt đầu một bài để ghi lại bước tiến đầu tiên.
									</p>
								)}
							</section>
						</div>
						<section className="panel">
							<h2>Bảy ngày vừa qua</h2>
							<p>
								Bạn đã học {data.week.reduce((sum, d) => sum + d.questions, 0)} câu trong{" "}
								{data.week.length} ngày hoạt động.
							</p>
							<p className="muted">
								{Math.round(data.week.reduce((sum, d) => sum + d.seconds, 0) / 60)} phút tương tác.
								Xem diễn biến độ chính xác theo ngày để nhận biết bước tiến của mình.
							</p>
							<Link className="text-link" href="/progress">
								Xem tiến độ tuần này <ArrowRight size={16} />
							</Link>
						</section>
					</>
				) : null}
			</DataState>
		</>
	);
}

export function ProgressPage() {
	const params = useSearchParams(),
		router = useRouter();
	const page = Math.max(1, Number(params.get("page")) || 1);
	const history = useData<PageResult<LearningSession>>(
		`learning-sessions/history?page=${page}${params.get("lessonId") ? `&lessonId=${encodeURIComponent(params.get("lessonId") || "")}` : ""}`,
	);
	function changePage(value: number) {
		const next = new URLSearchParams(params);
		next.set("page", String(value));
		router.replace(`/progress?${next}`, { scroll: false });
	}
	const query = useData<Dashboard>("progress"),
		data = query.data;
	return (
		<>
			<PageHeading
				title="Mỗi ngày, tiến thêm một chút."
				description="Hoàn thành bài và ghi nhớ kiến thức là hai hành trình khác nhau."
			/>
			<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
				{data ? (
					<>
						<div className="stats-grid">
							<div>
								<strong>{data.mastered}</strong>
								<span>Kiến thức đã ghi nhớ</span>
							</div>
							<div>
								<strong>{data.totalKnowledge}</strong>
								<span>Kiến thức trong thư viện</span>
							</div>
							<div>
								<strong>{data.streak}</strong>
								<span>Ngày học liên tiếp</span>
							</div>
							<div>
								<strong>{data.reviewCount}</strong>
								<span>Kiến thức cần ôn</span>
							</div>
						</div>
						<section className="panel">
							<h2>Độ chính xác theo ngày</h2>
							<p className="muted">
								Chỉ gồm học và ôn tập. Kết quả thi được lưu riêng trong Bài kiểm tra.
							</p>
							{data.daily.length ? (
								<div
									className="progress-chart"
									role="img"
									aria-label="Biểu đồ độ chính xác các ngày gần đây"
								>
									{data.daily.slice(-14).map((d) => (
										<div key={d.date}>
											<span>{d.accuracy}%</span>
											<div
												className="chart-bar"
												style={{ height: `${Math.max(3, d.accuracy * 1.4)}px` }}
											/>
											<small>
												{new Intl.DateTimeFormat("vi-VN", {
													day: "numeric",
													month: "numeric",
												}).format(new Date(d.date))}
											</small>
										</div>
									))}
								</div>
							) : (
								<Empty title="Tiến bộ bắt đầu từ bài đầu tiên">
									<Link className="text-link" href="/library">
										Đến thư viện
									</Link>
								</Empty>
							)}
						</section>
						<section className="panel">
							<h2>Lịch sử học</h2>
							<DataState loading={history.isLoading} error={history.error} retry={history.refetch}>
								{history.data?.items.map((s) => (
									<Link className="history-row" key={s.id} href={`/learn/${s.id}`}>
										<div>
											<strong>{s.title}</strong>
											<span>
												{dateLabel(s.createdAt)} · {s.kind === "LESSON" ? "Bài học" : "Ôn tập"}
											</span>
										</div>
										<span>
											{s.answered.length} câu · {s.accuracy}%<ArrowRight size={16} />
										</span>
									</Link>
								))}
							</DataState>
							<nav className="pagination" aria-label="Phân trang lịch sử">
								<Button variant="outline" disabled={page <= 1} onClick={() => changePage(page - 1)}>
									Trang trước
								</Button>
								<span>
									{page} / {Math.max(1, history.data?.meta.total_pages || 1)}
								</span>
								<Button
									variant="outline"
									disabled={page >= (history.data?.meta.total_pages || 1)}
									onClick={() => changePage(page + 1)}
								>
									Trang sau
								</Button>
							</nav>
						</section>
					</>
				) : null}
			</DataState>
		</>
	);
}
