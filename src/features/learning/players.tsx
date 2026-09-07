"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleX, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/api-client";
import { DataState, duration, ErrorText, useAction, useData } from "./shared";
import {
	type Attempt,
	type LearningSession,
	type PlayerQuestion,
	type Question,
	STAGES,
} from "./types";
import { useUnsaved } from "./use-unsaved";

function useActiveSeconds(key: string) {
	const seconds = useRef(0),
		activity = useRef(0);
	useEffect(() => {
		if (!key) return;
		seconds.current = 0;
		activity.current = Date.now();
		const active = () => {
			activity.current = Date.now();
		};
		const timer = setInterval(() => {
			if (document.visibilityState === "visible" && Date.now() - activity.current < 60000)
				seconds.current++;
		}, 1000);
		document.addEventListener("pointerdown", active);
		document.addEventListener("keydown", active);
		return () => {
			clearInterval(timer);
			document.removeEventListener("pointerdown", active);
			document.removeEventListener("keydown", active);
		};
	}, [key]);
	return {
		read: () => Math.min(86400, seconds.current),
		reset: () => {
			seconds.current = 0;
		},
	};
}
export function QuestionChoices({
	question,
	selected,
	onChange,
	locked = false,
	disabled = false,
}: {
	question: PlayerQuestion;
	selected: string[];
	onChange: (ids: string[]) => void;
	locked?: boolean;
	disabled?: boolean;
}) {
	return (
		<fieldset className="question-choices" disabled={locked || disabled}>
			<legend className="sr-only">
				{question.type === "SINGLE_CHOICE" ? "Chọn một đáp án" : "Chọn tất cả đáp án đúng"}
			</legend>
			{question.options.map((o, index) => {
				const picked = selected.includes(o.id);
				return (
					<label
						key={o.id}
						className={`choice ${picked ? "picked" : ""} ${locked && o.correct ? "correct" : ""} ${locked && picked && !o.correct ? "incorrect" : ""}`}
					>
						<input
							type={question.type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
							name={`answer-${question.id}`}
							value={o.id}
							checked={picked}
							onChange={() =>
								onChange(
									question.type === "SINGLE_CHOICE"
										? [o.id]
										: picked
											? selected.filter((id) => id !== o.id)
											: [...selected, o.id],
								)
							}
						/>
						<span className="choice-letter">{String.fromCharCode(65 + index)}</span>
						<span>{o.text}</span>
						{locked && o.correct ? <Check aria-label="Đáp án đúng" size={20} /> : null}
					</label>
				);
			})}
		</fieldset>
	);
}
function QuestionMedia({ question }: { question: Question }) {
	const [failed, setFailed] = useState(false);
	return (
		<>
			{question.media?.imageUrl ? (
				failed ? (
					<p className="notice">Không tải được ảnh. {question.media.description}</p>
				) : (
					// biome-ignore lint/performance/noImgElement: User media must load directly without a server-side proxy.
					<img
						className="question-image"
						src={question.media.imageUrl}
						alt={question.media.description || "Hình minh họa câu hỏi"}
						width={720}
						height={400}
						onError={() => setFailed(true)}
						referrerPolicy="no-referrer"
					/>
				)
			) : null}
			{question.media?.audioUrl ? (
				<div className="audio-block">
					<Volume2 aria-hidden="true" size={20} />
					<audio
						controls
						preload="none"
						src={question.media.audioUrl}
						aria-label={question.media.description || "Audio bài học"}
					>
						<track kind="captions" />
					</audio>
					{question.media.description ? <p>{question.media.description}</p> : null}
				</div>
			) : null}
		</>
	);
}
function Explanations({ question }: { question: Question }) {
	return (
		<div className="explanations">
			{question.options.map((o) => (
				<div key={o.id}>
					<strong>{o.text}</strong>
					<p>{o.correct ? "Đáp án đúng" : "Đáp án chưa đúng"}</p>
					<p>{o.explanation || (o.correct ? "Đáp án đúng." : "Chưa phù hợp với câu hỏi này.")}</p>
				</div>
			))}
		</div>
	);
}
export function LearningPlayer({ id }: { id: string }) {
	const query = useData<LearningSession>(`learning-sessions/${id}`);
	const client = useQueryClient();
	const [selected, setSelected] = useState<string[]>([]);
	const [feedback, setFeedback] = useState<LearningSession["feedback"]>(undefined);
	const session = query.data;
	const seconds = useActiveSeconds(feedback ? "" : session?.question?.id || "");
	const answer = useAction<LearningSession>(`learning-sessions/${id}/answers`, "POST", (s) => {
		setFeedback(s.feedback);
		client.setQueryData(["learning", `learning-sessions/${id}`], s);
	});
	const next = useAction<LearningSession>(`learning-sessions/${id}/next-stage`, "POST", (s) => {
		client.setQueryData(["learning", `learning-sessions/${id}`], s);
		setSelected([]);
	});
	const question = feedback?.question || session?.question;
	const heading = useRef<HTMLHeadingElement>(null);
	useEffect(() => {
		if (question?.id) heading.current?.focus({ preventScroll: true });
	}, [question?.id]);
	return (
		<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
			{session ? (
				<div className="player">
					<header className="player-header">
						<Link
							href={session.lessonId ? `/lessons/${session.lessonId}` : "/review"}
							className="back-link"
						>
							<X size={20} />
							Lưu và thoát
						</Link>
						<span>{session.title}</span>
						<span>{session.answered.length} câu đã học</span>
					</header>
					{session.kind === "LESSON" ? (
						<ol className="player-stages">
							{STAGES.map((s) => (
								<li
									key={s}
									className={
										session.completedStages.includes(s)
											? "done"
											: session.stage === s
												? "active"
												: ""
									}
								>
									{session.completedStages.includes(s) ? <Check size={15} /> : null}
									{s.charAt(0) + s.slice(1).toLowerCase()}
								</li>
							))}
						</ol>
					) : (
						<p className="caption">PHIÊN ÔN TẬP · {session.total} CÂU</p>
					)}
					{question ? (
						<section className="question-area" key={question.id}>
							<p className="muted">
								{question.type === "SINGLE_CHOICE"
									? "Chọn một đáp án đúng"
									: "Chọn tất cả đáp án đúng"}
							</p>
							<h1 ref={heading} tabIndex={-1}>
								{question.prompt}
							</h1>
							<QuestionMedia question={question} />
							<QuestionChoices
								question={question}
								selected={feedback?.selected || selected}
								onChange={(ids) => {
									setSelected(ids);
									if (question.type === "SINGLE_CHOICE" && !answer.isPending && !feedback) {
										answer.mutate({
											questionId: question.id,
											selected: ids,
											seconds: seconds.read(),
										});
									}
								}}
								locked={Boolean(feedback)}
								disabled={answer.isPending}
							/>
							{feedback ? (
								<Dialog
									open
									onOpenChange={(open) => {
										if (!open) {
											setFeedback(undefined);
											setSelected([]);
										}
									}}
								>
									<DialogContent
										className="answer-dialog"
										onPointerDownOutside={(event) => event.preventDefault()}
										onCloseAutoFocus={(event) => {
											event.preventDefault();
											heading.current?.focus();
										}}
									>
										<div
											className={`answer-banner ${feedback.correct ? "answer-success" : "answer-failure"}`}
										>
											{feedback.correct ? (
												<CheckCircle2 size={52} aria-hidden="true" />
											) : (
												<CircleX size={52} aria-hidden="true" />
											)}
											<DialogTitle>
												{feedback.correct ? "Chính xác!" : "Chưa đúng. Thử nhớ lại nhé."}
											</DialogTitle>
											<DialogDescription className="answer-description">
												Xem đáp án và giải thích trước khi tiếp tục.
											</DialogDescription>
										</div>
										<DialogBody>
											<Explanations question={feedback.question} />
										</DialogBody>
										<DialogFooter>
											<Button
												onClick={() => {
													setFeedback(undefined);
													setSelected([]);
												}}
											>
												Tiếp tục <ArrowRight />
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							) : null}
							<ErrorText error={answer.error || next.error} />
							<footer className="player-actions">
								{feedback ? (
									<Button
										size="lg"
										onClick={() => {
											setFeedback(undefined);
											setSelected([]);
										}}
									>
										Tiếp tục
										<ArrowRight />
									</Button>
								) : question.type === "MULTIPLE_CHOICE" || answer.isError ? (
									<Button
										size="lg"
										disabled={!selected.length || answer.isPending}
										onClick={() =>
											answer.mutate({ questionId: question.id, selected, seconds: seconds.read() })
										}
									>
										{answer.isPending
											? "Đang kiểm tra…"
											: answer.isError
												? "Thử lại"
												: "Kiểm tra đáp án"}
										<ArrowRight />
									</Button>
								) : (
									<p role="status">
										{answer.isPending ? "Đang kiểm tra…" : "Chọn một đáp án để xem kết quả ngay."}
									</p>
								)}
							</footer>
						</section>
					) : session.completedAt ? (
						<section className="session-result">
							<div className="result-icon">
								<CheckCircle2 size={48} strokeWidth={1.2} />
							</div>
							<h1>Thêm một bước tiến.</h1>
							<p>
								Bạn vừa hoàn thành {session.kind === "LESSON" ? "đủ 4 bước học" : "phiên ôn tập"}.
								Hẹn gặp lại ở lần ôn tiếp theo.
							</p>
							<div className="result-stats">
								<div>
									<strong>{session.accuracy}%</strong>
									<span>Chính xác</span>
								</div>
								<div>
									<strong>
										{session.correct}/{session.answered.length}
									</strong>
									<span>Câu đúng</span>
								</div>
								<div>
									<strong>{duration(session.duration)}</strong>
									<span>Thời gian học</span>
								</div>
							</div>
							<div className="actions">
								<Button asChild>
									<Link href="/dashboard">Về hôm nay</Link>
								</Button>
								<Button variant="outline" asChild>
									<Link href="/review">Xem kiến thức cần ôn</Link>
								</Button>
							</div>
						</section>
					) : (
						<section className="session-result">
							<CheckCircle2 size={44} />
							<h1>Hoàn thành {session.stage.charAt(0) + session.stage.slice(1).toLowerCase()}.</h1>
							<p>Chuyển sang góc nhìn tiếp theo của cùng một kiến thức.</p>
							<Button disabled={next.isPending} onClick={() => next.mutate(undefined)}>
								Sang bước tiếp theo
								<ArrowRight />
							</Button>
							<ErrorText error={next.error} />
						</section>
					)}
				</div>
			) : null}
		</DataState>
	);
}
export function ExamPlayer({ id }: { id: string }) {
	const query = useData<Attempt>(`exam-attempts/${id}`);
	return (
		<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
			{query.data ? <ExamRun key={id} initial={query.data} /> : null}
		</DataState>
	);
}
function ExamRun({ initial }: { initial: Attempt }) {
	const [attempt, setAttempt] = useState(initial),
		[index, setIndex] = useState(0),
		[answers, setAnswers] = useState(initial.answers);
	const [busy, setBusy] = useState(false),
		[error, setError] = useState<Error | null>(null),
		[confirm, setConfirm] = useState(false);
	const client = useQueryClient(),
		question = attempt.questions[index];
	const seconds = useActiveSeconds(question.id);
	const heading = useRef<HTMLHeadingElement>(null);
	const resultHeading = useRef<HTMLHeadingElement>(null);
	useEffect(() => {
		if (question.id) heading.current?.focus({ preventScroll: true });
	}, [question.id]);
	useEffect(() => {
		if (attempt.submittedAt) resultHeading.current?.focus();
	}, [attempt.submittedAt]);
	const dirty = !attempt.submittedAt && JSON.stringify(answers) !== JSON.stringify(attempt.answers);
	useUnsaved(dirty);
	async function save() {
		const saved = await apiRequest<Attempt>(`exam-attempts/${attempt.id}/answers`, {
			method: "PATCH",
			body: JSON.stringify({
				questionId: question.id,
				selected: answers[question.id] || [],
				seconds: seconds.read(),
			}),
		});
		setAttempt(saved);
		seconds.reset();
		return saved;
	}
	async function go(target: number) {
		if (busy) return;
		setBusy(true);
		setError(null);
		try {
			if (!attempt.submittedAt) await save();
			setIndex(target);
		} catch (e) {
			setError(e as Error);
		} finally {
			setBusy(false);
		}
	}
	async function submit() {
		if (busy) return;
		setBusy(true);
		setError(null);
		try {
			await save();
			const result = await apiRequest<Attempt>(`exam-attempts/${attempt.id}/submit`, {
				method: "POST",
			});
			const detail = await apiRequest<Attempt>(`exam-attempts/${attempt.id}`);
			setAttempt({ ...result, improvement: detail.improvement });
			setConfirm(false);
			void client.invalidateQueries({ queryKey: ["learning"] });
		} catch (e) {
			setError(e as Error);
		} finally {
			setBusy(false);
		}
	}
	const unanswered = attempt.questions.filter((q) => !answers[q.id]?.length).length;
	return (
		<div className="player">
			<header className="player-header">
				<Link className="back-link" href="/exams">
					<X size={20} />
					Bài kiểm tra
				</Link>
				<span>{attempt.title}</span>
				<span>Phiên bản {attempt.version}</span>
			</header>
			{attempt.submittedAt ? (
				<section className="exam-result">
					<span className="caption">KẾT QUẢ CỦA BẠN</span>
					<h1 ref={resultHeading} tabIndex={-1}>
						{attempt.accuracy}%
					</h1>
					<p>
						{attempt.score} / {attempt.questions.length} câu đúng · {duration(attempt.duration)}
					</p>
					{attempt.improvement != null ? (
						<p>
							{attempt.improvement >= 0 ? "+" : ""}
							{attempt.improvement} điểm phần trăm so với lần trước cùng phiên bản.
						</p>
					) : (
						<p className="muted">Chưa có lần thi trước cùng phiên bản để so sánh.</p>
					)}
				</section>
			) : (
				<p className="notice">Đáp án và giải thích sẽ xuất hiện sau khi bạn nộp bài.</p>
			)}
			<nav className="question-nav" aria-label="Chọn câu hỏi">
				{attempt.questions.map((q, i) => (
					<button
						type="button"
						key={q.id}
						disabled={busy}
						aria-label={`Câu ${i + 1}${answers[q.id]?.length ? ", đã trả lời" : ""}`}
						aria-current={index === i ? "step" : undefined}
						className={index === i ? "active" : answers[q.id]?.length ? "answered" : ""}
						onClick={() => go(i)}
					>
						{i + 1}
					</button>
				))}
			</nav>
			<section className="question-area">
				<span className="caption">
					Câu {index + 1} / {attempt.questions.length}
				</span>
				<h2 ref={heading} tabIndex={-1} className="question-title">
					{question.prompt}
				</h2>
				<QuestionMedia key={question.id} question={question} />
				<p className="muted">
					{question.type === "SINGLE_CHOICE" ? "Chọn một đáp án" : "Chọn tất cả đáp án đúng"}
				</p>
				<QuestionChoices
					question={question}
					selected={answers[question.id] || []}
					locked={Boolean(attempt.submittedAt)}
					disabled={busy}
					onChange={(selected) => setAnswers({ ...answers, [question.id]: selected })}
				/>
				{attempt.submittedAt ? <Explanations question={question} /> : null}
				<ErrorText error={error} />
				<footer className="player-actions spread">
					<Button variant="outline" disabled={index === 0 || busy} onClick={() => go(index - 1)}>
						<ArrowLeft />
						Câu trước
					</Button>
					<div className="actions">
						{!attempt.submittedAt ? (
							<Button variant="outline" disabled={busy} onClick={() => go(index)}>
								{busy ? "Đang lưu…" : "Lưu đáp án"}
							</Button>
						) : null}
						{index < attempt.questions.length - 1 ? (
							<Button disabled={busy} onClick={() => go(index + 1)}>
								Câu tiếp theo
								<ArrowRight />
							</Button>
						) : !attempt.submittedAt ? (
							<Button disabled={busy} onClick={() => setConfirm(true)}>
								Nộp bài
							</Button>
						) : (
							<Button asChild>
								<Link href="/exams">Xem lịch sử</Link>
							</Button>
						)}
					</div>
				</footer>
				{confirm ? (
					<div className="panel confirm-submit" role="alertdialog" aria-label="Xác nhận nộp bài">
						<h2>Nộp bài kiểm tra?</h2>
						<p>
							{unanswered
								? `Còn ${unanswered} câu chưa trả lời. Các câu này sẽ tính là sai.`
								: "Bạn đã trả lời tất cả các câu."}{" "}
							Sau khi nộp không thể đổi đáp án.
						</p>
						<div className="actions">
							<Button disabled={busy} onClick={submit}>
								{busy ? "Đang nộp…" : "Xác nhận nộp"}
							</Button>
							<Button variant="outline" disabled={busy} onClick={() => setConfirm(false)}>
								Kiểm tra lại
							</Button>
						</div>
					</div>
				) : null}
			</section>
		</div>
	);
}
