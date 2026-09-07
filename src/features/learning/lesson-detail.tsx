"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Copy, Download, Pencil, Play, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { apiRequest } from "@/lib/api-client";
import {
	DataState,
	dateLabel,
	duration,
	ErrorText,
	PageHeading,
	useAction,
	useData,
} from "./shared";
import {
	type Collection,
	type LearningSession,
	type Lesson,
	type ProgressItem,
	STAGES,
	STATUS_LABELS,
	TYPE_LABELS,
} from "./types";

export function LessonDetail({ id, publicView = false }: { id: string; publicView?: boolean }) {
	const auth = useAuth(),
		router = useRouter();
	const query = useData<Lesson>(`${publicView ? "public/" : ""}lessons/${id}`);
	const progress = useData<ProgressItem[]>("knowledge-progress", !publicView);
	const sessions = useData<LearningSession[]>("learning-sessions", !publicView);
	const library = useData<Collection[]>("collections", publicView && auth.authenticated);
	const [topic, setTopic] = useState("");
	const [confirm, setConfirm] = useState(false);
	const [exportError, setExportError] = useState<Error | null>(null);
	const start = useAction<LearningSession>("learning-sessions", "POST", (s) =>
		router.push(`/learn/${s.id}`),
	);
	const copy = useAction<Lesson>(`public/lessons/${id}/copy`, "POST", (l) =>
		router.push(`/lessons/${l.id}`),
	);
	const remove = useAction(`lessons/${id}`, "DELETE", () => router.push("/library"));
	const lesson = query.data,
		history = (sessions.data || []).filter((s) => s.lessonId === id);
	const learned = progress.data?.filter((p) => p.lessonId === id) || [];
	const mastered = learned.filter((p) => p.status === "MASTERED").length;
	const completed = lesson?.completed || history.some((s) => s.completedStages.length === 4);
	const latestStages = completed ? [...STAGES] : history[0]?.completedStages || [];
	async function exportJSON() {
		try {
			const doc = await apiRequest(`lessons/${id}/export`);
			const url = URL.createObjectURL(
				new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" }),
			);
			const a = document.createElement("a");
			a.href = url;
			a.download = "lesson.json";
			a.click();
			URL.revokeObjectURL(url);
		} catch (e) {
			setExportError(e as Error);
		}
	}
	return (
		<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
			{lesson ? (
				<>
					<Link className="back-link" href={publicView ? "/explore" : "/library"}>
						← {publicView ? "Khám phá" : "Thư viện của tôi"}
					</Link>
					<PageHeading title={lesson.title} description={lesson.description}>
						{publicView ? null : (
							<>
								<Button variant="outline" onClick={exportJSON}>
									<Download />
									Export
								</Button>
								<Button variant="outline" asChild>
									<Link href={`/lessons/${id}/edit`}>
										<Pencil />
										Chỉnh sửa
									</Link>
								</Button>
								<Button
									disabled={lesson.visibility === "DRAFT" || start.isPending}
									onClick={() => start.mutate({ lessonId: id })}
								>
									<Play />
									Bắt đầu học
								</Button>
							</>
						)}
					</PageHeading>
					<ErrorText error={start.error || exportError} />
					{lesson.sourceAuthor ? (
						<p className="muted">
							Nội dung gốc bởi {lesson.sourceAuthor}. Bản sao này thuộc về bạn.
						</p>
					) : null}
					{publicView ? (
						<section className="panel copy-panel">
							<div>
								<h2>Mang bài học về thư viện</h2>
								<p>
									Tác giả: {lesson.owner?.name}. Bạn có thể chỉnh sửa bản sao và học theo cách
									riêng.
								</p>
							</div>
							{auth.authenticated ? (
								<>
									<label>
										Chủ đề đích
										<select value={topic} onChange={(e) => setTopic(e.target.value)}>
											<option value="">Chọn chủ đề</option>
											{library.data
												?.flatMap((c) => c.topics)
												.map((t) => (
													<option value={t.id} key={t.id}>
														{t.name}
													</option>
												))}
										</select>
									</label>
									<Button
										disabled={!topic || copy.isPending}
										onClick={() => copy.mutate({ topicId: topic })}
									>
										<Copy />
										Sao chép bài
									</Button>
									{library.data && !library.data.some((c) => c.topics.length) ? (
										<Link className="text-link" href="/library">
											Tạo chủ đề trước khi sao chép
										</Link>
									) : null}
									<ErrorText error={copy.error || library.error} />
								</>
							) : (
								<Button asChild>
									<Link href="/login">Đăng nhập để sao chép</Link>
								</Button>
							)}
						</section>
					) : (
						<section className="panel">
							<div className="stage-progress">
								{STAGES.map((stage) => (
									<div key={stage} className={latestStages.includes(stage) ? "complete" : ""}>
										<span>{latestStages.includes(stage) ? "✓" : "○"}</span>
										<strong>{stage.charAt(0) + stage.slice(1).toLowerCase()}</strong>
										<small>{latestStages.includes(stage) ? "Hoàn thành" : "Chưa hoàn thành"}</small>
									</div>
								))}
							</div>
							<div className="lesson-summary">
								<span>
									Hoàn thành <strong>{latestStages.length * 25}%</strong>
								</span>
								<span>
									Ghi nhớ{" "}
									<strong>
										{learned.length ? Math.round((mastered / learned.length) * 100) : 0}%
									</strong>
								</span>
								<span>{history.length} lần học</span>
							</div>
							<p className="muted">
								Hoàn thành đủ 4 bước không đồng nghĩa với thành thạo. Hãy quay lại để nhớ lâu hơn.
							</p>
							{lesson.visibility === "DRAFT" ? (
								<p className="notice">
									Bài đang là bản nháp. Hoàn thiện các câu hỏi rồi đổi sang Cá nhân để học.
								</p>
							) : null}
						</section>
					)}
					<section className="panel">
						<h2>{lesson.knowledgeItems.length} kiến thức trong bài</h2>
						{lesson.knowledgeItems.map((item) => {
							const p = learned.find((v) => v.id === item.id);
							return (
								<details key={item.id} className="knowledge-detail">
									<summary>
										<div>
											<strong>{item.term}</strong>
											<span>
												{TYPE_LABELS[item.type]} · {item.meaning}
											</span>
										</div>
										{p ? (
											<span className={`status status-${p.status.toLowerCase()}`}>
												{STATUS_LABELS[p.status]}
											</span>
										) : (
											<span>{item.questions.length} câu hỏi</span>
										)}
									</summary>
									<div className="stack">
										{p ? (
											<p>
												{p.seen} lượt gặp · {p.correct} đúng · {p.wrong} sai · {p.accuracy}% chính
												xác
											</p>
										) : null}
										{item.questions.map((q) => (
											<div key={q.id} className="question-preview">
												<span className="caption">{q.stage}</span>
												<h3>{q.prompt}</h3>
												<ul>
													{q.options.map((o) => (
														<li key={o.id}>
															<strong>
																{o.correct ? "✓ " : ""}
																{o.text}
															</strong>
															{o.explanation ? <span> {o.explanation}</span> : null}
														</li>
													))}
												</ul>
											</div>
										))}
									</div>
								</details>
							);
						})}
					</section>
					{!publicView ? (
						<>
							<section className="panel">
								<h2>Lịch sử bài học</h2>
								{history.length ? (
									history.map((s) => (
										<Link className="history-row" key={s.id} href={`/learn/${s.id}`}>
											<div>
												<strong>{dateLabel(s.createdAt)}</strong>
												<span>
													{s.answered.length} câu · {duration(s.duration)}
												</span>
											</div>
											<span>
												{s.completedAt ? `${s.accuracy}% chính xác` : "Học tiếp"}
												<ArrowRight size={16} />
											</span>
										</Link>
									))
								) : (
									<p className="muted">Chưa có phiên học cho bài này.</p>
								)}
							</section>
							<div className="delete-section">
								{confirm ? (
									<>
										<p>Xóa bài khỏi thư viện? Lịch sử học vẫn được giữ.</p>
										<Button
											variant="destructive"
											disabled={remove.isPending}
											onClick={() => remove.mutate(undefined)}
										>
											Xác nhận xóa
										</Button>
										<Button variant="ghost" onClick={() => setConfirm(false)}>
											Hủy
										</Button>
									</>
								) : (
									<Button variant="ghost" onClick={() => setConfirm(true)}>
										<Trash2 />
										Xóa bài học
									</Button>
								)}
								<ErrorText error={remove.error} />
							</div>
						</>
					) : null}
				</>
			) : null}
		</DataState>
	);
}
