"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import { DataState, dateLabel, Empty, ErrorText, PageHeading, useAction, useData } from "./shared";
import type { Attempt, Collection, Exam, Lesson, PageResult, Question } from "./types";
import { useUnsaved } from "./use-unsaved";

function ExamRow({ exam }: { exam: Exam }) {
	const router = useRouter(),
		[confirm, setConfirm] = useState(false);
	const start = useAction<Attempt>(`exams/${exam.id}/attempts`, "POST", (a) =>
		router.push(`/exam-attempts/${a.id}`),
	);
	const remove = useAction(`exams/${exam.id}`, "DELETE");
	return (
		<section className="panel exam-card">
			<div className="section-title">
				<div>
					<h2>{exam.title}</h2>
					<p>
						{exam.questions.length} câu hỏi · Phiên bản {exam.version}
					</p>
				</div>
				<div className="actions">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Xóa đề"
						onClick={() => setConfirm(!confirm)}
					>
						<Trash2 />
					</Button>
					<Button variant="outline" asChild>
						<Link href={`/exams/${exam.id}/edit`}>
							<Pencil />
							Chỉnh sửa
						</Link>
					</Button>
					<Button disabled={start.isPending} onClick={() => start.mutate(undefined)}>
						<Play />
						Làm bài
					</Button>
				</div>
			</div>
			<ErrorText error={start.error || remove.error} />
			{confirm ? (
				<div className="notice">
					<p>Xóa đề? Các kết quả đã có vẫn được giữ.</p>
					<Button
						variant="destructive"
						disabled={remove.isPending}
						onClick={() => remove.mutate(undefined)}
					>
						Xác nhận xóa
					</Button>
				</div>
			) : null}
			{exam.attempts.length ? (
				<details>
					<summary>{exam.attempts.length} lần làm bài</summary>
					{exam.attempts.map((a) => (
						<Link key={a.id} className="history-row" href={`/exam-attempts/${a.id}`}>
							<div>
								<strong>{dateLabel(a.createdAt)}</strong>
								<span>
									Phiên bản {a.version}
									{a.version !== exam.version ? " · Đề đã được chỉnh sửa" : ""}
								</span>
							</div>
							<span>{a.submittedAt ? `${a.score} câu đúng` : "Tiếp tục làm bài"}</span>
						</Link>
					))}
				</details>
			) : (
				<p className="muted">Chưa có lần làm bài. Kết quả sẽ xuất hiện tại đây.</p>
			)}
		</section>
	);
}
export function ExamsPage() {
	const query = useData<Exam[]>("exams");
	const params = useSearchParams(),
		router = useRouter();
	const page = Math.max(1, Number(params.get("page")) || 1);
	const history = useData<
		PageResult<Pick<Attempt, "id" | "title" | "createdAt" | "version" | "submittedAt" | "accuracy">>
	>(`exam-attempts?page=${page}`);
	return (
		<>
			<PageHeading
				title="Biết mình đã nhớ đến đâu."
				description="Tự chọn câu hỏi, làm bài và nhìn lại sự tiến bộ qua từng lần thử."
			>
				<Button asChild>
					<Link href="/exams/new/edit">
						<Plus />
						Tạo bài kiểm tra
					</Link>
				</Button>
			</PageHeading>
			<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
				{query.data?.length ? (
					query.data.map((e) => <ExamRow key={e.id} exam={e} />)
				) : (
					<Empty title="Bài kiểm tra đầu tiên của bạn">
						<p>Tạo đề từ những bài học cá nhân đã hoàn thiện.</p>
					</Empty>
				)}
			</DataState>
			<section className="panel">
				<h2>Mọi lần làm bài</h2>
				<p className="muted">
					Giữ cả lịch sử của những đề đã xóa. Chỉ so sánh trực tiếp các lượt cùng phiên bản.
				</p>
				<DataState loading={history.isLoading} error={history.error} retry={history.refetch}>
					{history.data?.items.map((a) => (
						<Link key={a.id} href={`/exam-attempts/${a.id}`} className="history-row">
							<div>
								<strong>{a.title}</strong>
								<span>
									{dateLabel(a.createdAt)} · Phiên bản {a.version}
								</span>
							</div>
							<span>{a.submittedAt ? `${a.accuracy}%` : "Làm tiếp"}</span>
						</Link>
					))}
					{!history.data?.items.length ? <p>Chưa có lượt thi nào.</p> : null}
				</DataState>
				<nav className="pagination" aria-label="Phân trang lượt thi">
					<Button
						variant="outline"
						disabled={page <= 1}
						onClick={() => router.replace(`/exams?page=${page - 1}`, { scroll: false })}
					>
						Trang trước
					</Button>
					<span>
						{page} / {Math.max(1, history.data?.meta.total_pages || 1)}
					</span>
					<Button
						variant="outline"
						disabled={page >= (history.data?.meta.total_pages || 1)}
						onClick={() => router.replace(`/exams?page=${page + 1}`, { scroll: false })}
					>
						Trang sau
					</Button>
				</nav>
			</section>
		</>
	);
}
export function ExamEditor({ id }: { id: string }) {
	const exams = useData<Exam[]>("exams", id !== "new"),
		library = useData<Collection[]>("collections");
	return (
		<DataState
			loading={library.isLoading || (id !== "new" && exams.isLoading)}
			error={
				library.error ||
				exams.error ||
				(id !== "new" && exams.data && !exams.data.some((e) => e.id === id)
					? new Error("Không tìm thấy bài kiểm tra.")
					: null)
			}
			retry={() => {
				void library.refetch();
				void exams.refetch();
			}}
		>
			{library.data && (id === "new" || exams.data?.some((e) => e.id === id)) ? (
				<ExamForm key={id} initial={exams.data?.find((e) => e.id === id)} library={library.data} />
			) : null}
		</DataState>
	);
}
function ExamForm({ initial, library }: { initial?: Exam; library: Collection[] }) {
	const router = useRouter(),
		[title, setTitle] = useState(initial?.title || ""),
		[selected, setSelected] = useState<Question[]>(initial?.questions || []);
	const [bank, setBank] = useState<Question[]>([]),
		[error, setError] = useState<Error | null>(null),
		[loading, setLoading] = useState(false),
		[dirty, setDirty] = useState(false);
	useUnsaved(dirty);
	const save = useAction<Exam>(
		initial ? `exams/${initial.id}` : "exams",
		initial ? "PATCH" : "POST",
		() => {
			setDirty(false);
			router.push("/exams");
		},
	);
	const lessons = library
		.flatMap((c) => c.topics.flatMap((t) => t.lessons))
		.filter((l) => l.visibility !== "DRAFT");
	async function load(id: string) {
		if (!id) {
			setBank([]);
			return;
		}
		setLoading(true);
		setError(null);
		try {
			const l = await apiRequest<Lesson>(`lessons/${id}`);
			setBank(l.knowledgeItems.flatMap((i) => i.questions.map((q) => ({ ...q, term: i.term }))));
		} catch (e) {
			setError(e as Error);
		} finally {
			setLoading(false);
		}
	}
	function reorder(i: number, d: number) {
		const next = [...selected];
		[next[i], next[i + d]] = [next[i + d], next[i]];
		setSelected(next);
		setDirty(true);
	}
	return (
		<>
			<PageHeading
				title={initial ? "Chỉnh sửa bài kiểm tra" : "Tạo bài kiểm tra"}
				description="Chọn câu hỏi theo ý bạn. Thứ tự bên phải là thứ tự làm bài."
			>
				<Button
					disabled={save.isPending || !selected.length || !title.trim()}
					onClick={() =>
						save.mutate({
							title,
							questionIds: selected.map((q) => q.id),
							version: initial?.version,
						})
					}
				>
					{save.isPending ? "Đang lưu…" : "Lưu bài kiểm tra"}
				</Button>
			</PageHeading>
			<ErrorText error={save.error || error} />
			<label className="panel block">
				Tên bài kiểm tra
				<Input
					value={title}
					onChange={(e) => {
						setTitle(e.target.value);
						setDirty(true);
					}}
					placeholder="Ví dụ: Giao tiếp cơ bản"
				/>
			</label>
			<div className="exam-editor-grid">
				<section className="panel">
					<h2>Ngân hàng câu hỏi</h2>
					<label>
						Chọn bài học
						<select defaultValue="" onChange={(e) => load(e.target.value)}>
							<option value="">Chọn bài học cá nhân</option>
							{lessons.map((l) => (
								<option key={l.id} value={l.id}>
									{l.title}
								</option>
							))}
						</select>
					</label>
					{loading ? (
						<p>Đang tải câu hỏi…</p>
					) : (
						bank.map((q) => (
							<label className="bank-question" key={q.id}>
								<input
									type="checkbox"
									checked={selected.some((s) => s.id === q.id)}
									onChange={(e) => {
										setSelected(
											e.target.checked ? [...selected, q] : selected.filter((s) => s.id !== q.id),
										);
										setDirty(true);
									}}
								/>
								<span>
									<small>
										{q.term} · {q.stage}
									</small>
									{q.prompt}
								</span>
							</label>
						))
					)}
					{!lessons.length ? (
						<p className="muted">Hoàn thiện một bài học cá nhân trước khi tạo đề.</p>
					) : null}
				</section>
				<section className="panel">
					<h2>Đã chọn {selected.length} câu</h2>
					{selected.map((q, i) => (
						<div className="selected-question" key={q.id}>
							<span>{i + 1}.</span>
							<p>{q.prompt}</p>
							<div className="actions">
								<Button
									variant="ghost"
									size="icon-xs"
									disabled={i === 0}
									aria-label="Đưa câu lên"
									onClick={() => reorder(i, -1)}
								>
									<ArrowUp />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									disabled={i === selected.length - 1}
									aria-label="Đưa câu xuống"
									onClick={() => reorder(i, 1)}
								>
									<ArrowDown />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="Bỏ câu hỏi"
									onClick={() => {
										setSelected(selected.filter((s) => s.id !== q.id));
										setDirty(true);
									}}
								>
									<Trash2 />
								</Button>
							</div>
						</div>
					))}
				</section>
			</div>
		</>
	);
}
