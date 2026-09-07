"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { move, stageNeighbor } from "./order";
import { DataState, ErrorText, PageHeading, useAction, useData } from "./shared";
import {
	type Collection,
	type Knowledge,
	type Lesson,
	type Media,
	type Question,
	STAGES,
	TYPE_LABELS,
	TYPES,
} from "./types";
import { useUnsaved } from "./use-unsaved";

function MediaFields({ value, onChange }: { value?: Media; onChange: (media: Media) => void }) {
	return (
		<details className="media-fields">
			<summary>Ảnh và phát âm (tùy chọn)</summary>
			<div className="form-grid">
				<label>
					URL ảnh HTTPS
					<Input
						type="url"
						value={value?.imageUrl || ""}
						placeholder="https://…"
						onChange={(e) =>
							onChange({
								...value,
								description: value?.description || "",
								imageUrl: e.target.value || undefined,
							})
						}
					/>
				</label>
				<label>
					URL audio HTTPS
					<Input
						type="url"
						value={value?.audioUrl || ""}
						placeholder="https://…"
						onChange={(e) =>
							onChange({
								...value,
								description: value?.description || "",
								audioUrl: e.target.value || undefined,
							})
						}
					/>
				</label>
				<label className="full-width">
					Mô tả ảnh / nội dung audio
					<Input
						value={value?.description || ""}
						onChange={(e) => onChange({ ...value, description: e.target.value })}
					/>
				</label>
			</div>
		</details>
	);
}
const newQuestion = (stage: Question["stage"]): Question => ({
	stage,
	type: "SINGLE_CHOICE",
	prompt: "",
	options: [
		{ text: "", correct: true, explanation: "" },
		{ text: "", correct: false, explanation: "" },
	],
});
const newKnowledge = (): Knowledge => ({
	term: "",
	meaning: "",
	type: "VOCABULARY",
	questions: STAGES.map(newQuestion),
});

export function LessonEditor({ id }: { id: string }) {
	const query = useData<Lesson>(`lessons/${id}`, id !== "new");
	const library = useData<Collection[]>("collections");
	return (
		<DataState
			loading={library.isLoading || (id !== "new" && query.isLoading)}
			error={library.error || query.error}
			retry={() => {
				void library.refetch();
				void query.refetch();
			}}
		>
			{library.data && (id === "new" || query.data) ? (
				<EditorForm key={id} initial={query.data} library={library.data} />
			) : null}
		</DataState>
	);
}
function EditorForm({ initial, library }: { initial?: Lesson; library: Collection[] }) {
	const params = useSearchParams(),
		router = useRouter();
	const topics = library.flatMap((c) => c.topics);
	const [lesson, setLesson] = useState<Lesson>(
		initial || {
			id: "",
			title: "",
			description: "",
			topicId: params.get("topic") || topics[0]?.id || "",
			visibility: "DRAFT",
			version: 1,
			knowledgeItems: [newKnowledge()],
		},
	);
	const [dirty, setDirty] = useState(false);
	const [activeItem, setActiveItem] = useState(0);
	const [activeStage, setActiveStage] = useState<Question["stage"]>("LEARN");
	useUnsaved(dirty);
	const save = useAction<Lesson>(
		lesson.id ? `lessons/${lesson.id}` : "lessons",
		lesson.id ? "PATCH" : "POST",
		(saved) => {
			setDirty(false);
			setLesson(saved);
			router.replace(`/lessons/${saved.id}/edit`);
		},
	);
	function edit(change: Partial<Lesson>) {
		setLesson((l) => ({ ...l, ...change }));
		setDirty(true);
	}
	function editItem(change: Partial<Knowledge>) {
		edit({
			knowledgeItems: lesson.knowledgeItems.map((k, i) =>
				i === activeItem ? { ...k, ...change } : k,
			),
		});
	}
	const item = lesson.knowledgeItems[activeItem];
	function editQuestion(index: number, change: Partial<Question>) {
		editItem({ questions: item.questions.map((q, i) => (i === index ? { ...q, ...change } : q)) });
	}
	return (
		<>
			<Link className="back-link" href={lesson.id ? `/lessons/${lesson.id}` : "/library"}>
				<ChevronLeft size={16} />
				{lesson.id ? "Xem bài học" : "Thư viện"}
			</Link>
			<PageHeading
				title={lesson.id ? "Chỉnh sửa bài học" : "Một bài học của riêng bạn"}
				description="Bắt đầu từ kiến thức, rồi tạo câu hỏi cho từng bước học."
			>
				<span className="caption" aria-live="polite">
					{dirty ? "Có thay đổi chưa lưu" : lesson.id ? "Đã lưu" : "Bài mới"}
				</span>
				<Button disabled={save.isPending || !topics.length} onClick={() => save.mutate(lesson)}>
					<Save />
					{save.isPending ? "Đang lưu…" : "Lưu bài học"}
				</Button>
			</PageHeading>
			{!topics.length ? (
				<div className="panel">
					<p>Bạn cần một chủ đề để đặt bài học.</p>
					<Link className="text-link" href="/library">
						Tạo bộ sưu tập và chủ đề
					</Link>
				</div>
			) : null}
			<ErrorText error={save.error} />
			<section className="panel form-grid">
				<label>
					Tên bài học
					<Input
						value={lesson.title}
						onChange={(e) => edit({ title: e.target.value })}
						placeholder="Ví dụ: Chào hỏi mỗi ngày"
						maxLength={200}
						required
					/>
				</label>
				<label>
					Chủ đề
					<select value={lesson.topicId} onChange={(e) => edit({ topicId: e.target.value })}>
						{topics.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</select>
				</label>
				<label className="full-width">
					Giới thiệu ngắn
					<textarea
						rows={2}
						value={lesson.description}
						onChange={(e) => edit({ description: e.target.value })}
					/>
				</label>
				<label>
					Trạng thái
					<select
						value={lesson.visibility}
						onChange={(e) => edit({ visibility: e.target.value as Lesson["visibility"] })}
					>
						<option value="DRAFT">Bản nháp</option>
						<option value="PRIVATE">Cá nhân</option>
						<option value="PUBLIC">Công khai</option>
					</select>
				</label>
				<p className="muted">
					Bài cá nhân hoặc công khai cần đủ câu hỏi hợp lệ cho 4 stage của từng kiến thức.
				</p>
			</section>
			{lesson.knowledgeItems.length > 8 ? (
				<p className="notice">
					Bài có hơn 8 kiến thức. Bạn có thể chia thành các bài ngắn để dễ học lại.
				</p>
			) : null}
			<div className="editor-grid">
				<aside className="editor-index">
					<h2>
						Kiến thức <small>{lesson.knowledgeItems.length}</small>
					</h2>
					{lesson.knowledgeItems.map((k, i) => (
						<div
							key={k.id || i}
							className={activeItem === i ? "knowledge-nav selected" : "knowledge-nav"}
						>
							<button type="button" onClick={() => setActiveItem(i)}>
								<span>{i + 1}</span>
								{k.term || "Kiến thức mới"}
							</button>
							<div className="actions">
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="Di chuyển kiến thức lên"
									disabled={!i}
									onClick={() => {
										edit({ knowledgeItems: move(lesson.knowledgeItems, i, -1) });
										setActiveItem(i - 1);
									}}
								>
									<ArrowUp />
								</Button>
								<Button
									variant="ghost"
									size="icon-xs"
									aria-label="Di chuyển kiến thức xuống"
									disabled={i === lesson.knowledgeItems.length - 1}
									onClick={() => {
										edit({ knowledgeItems: move(lesson.knowledgeItems, i, 1) });
										setActiveItem(i + 1);
									}}
								>
									<ArrowDown />
								</Button>
							</div>
						</div>
					))}
					<Button
						variant="outline"
						onClick={() => {
							edit({ knowledgeItems: [...lesson.knowledgeItems, newKnowledge()] });
							setActiveItem(lesson.knowledgeItems.length);
						}}
					>
						<Plus />
						Thêm kiến thức
					</Button>
				</aside>
				{item ? (
					<section className="editor-content">
						<div className="panel stack">
							<div className="section-title">
								<h2>{item.term || "Kiến thức mới"}</h2>
								<Button
									variant="ghost"
									onClick={() => {
										if (window.confirm("Xóa kiến thức này và các câu hỏi?")) {
											edit({
												knowledgeItems: lesson.knowledgeItems.filter((_, i) => i !== activeItem),
											});
											setActiveItem(Math.max(0, activeItem - 1));
										}
									}}
								>
									<Trash2 />
									Xóa kiến thức
								</Button>
							</div>
							<div className="form-grid">
								<label>
									Từ / cấu trúc
									<Input
										value={item.term}
										onChange={(e) => editItem({ term: e.target.value })}
										placeholder="hello"
									/>
								</label>
								<label>
									Loại kiến thức
									<select
										value={item.type}
										onChange={(e) => editItem({ type: e.target.value as Knowledge["type"] })}
									>
										{TYPES.map((t) => (
											<option key={t} value={t}>
												{TYPE_LABELS[t]}
											</option>
										))}
									</select>
								</label>
								<label className="full-width">
									Ý nghĩa / giải thích
									<textarea
										rows={2}
										value={item.meaning}
										onChange={(e) => editItem({ meaning: e.target.value })}
										placeholder="Xin chào. Dùng khi gặp một người."
									/>
								</label>
							</div>
							<MediaFields value={item.media} onChange={(media) => editItem({ media })} />
						</div>
						<div className="stage-tabs" role="tablist" aria-label="Giai đoạn học">
							{STAGES.map((s) => (
								<button
									type="button"
									role="tab"
									aria-selected={activeStage === s}
									className={activeStage === s ? "active" : ""}
									key={s}
									onClick={() => setActiveStage(s)}
								>
									{s.charAt(0) + s.slice(1).toLowerCase()}
									<small>{item.questions.filter((q) => q.stage === s).length}</small>
								</button>
							))}
						</div>
						{item.questions.map((q, index) =>
							q.stage === activeStage ? (
								<div className="panel question-editor stack" key={q.id || index}>
									<div className="section-title">
										<h3>
											Câu hỏi{" "}
											{
												item.questions.filter((v, i) => i <= index && v.stage === activeStage)
													.length
											}
										</h3>
										<div className="actions">
											<Button
												variant="ghost"
												size="icon"
												disabled={stageNeighbor(item.questions, index, -1) === index}
												aria-label="Di chuyển câu hỏi lên"
												onClick={() =>
													editItem({
														questions: move(
															item.questions,
															index,
															stageNeighbor(item.questions, index, -1) - index,
														),
													})
												}
											>
												<ArrowUp />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												disabled={stageNeighbor(item.questions, index, 1) === index}
												aria-label="Di chuyển câu hỏi xuống"
												onClick={() =>
													editItem({
														questions: move(
															item.questions,
															index,
															stageNeighbor(item.questions, index, 1) - index,
														),
													})
												}
											>
												<ArrowDown />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												aria-label="Xóa câu hỏi"
												onClick={() => {
													if (window.confirm("Xóa câu hỏi này?"))
														editItem({ questions: item.questions.filter((_, i) => i !== index) });
												}}
											>
												<Trash2 />
											</Button>
										</div>
									</div>
									<label>
										Nội dung câu hỏi
										<textarea
											rows={2}
											value={q.prompt}
											onChange={(e) => editQuestion(index, { prompt: e.target.value })}
										/>
									</label>
									<label>
										Cách trả lời
										<select
											value={q.type}
											onChange={(e) =>
												editQuestion(index, { type: e.target.value as Question["type"] })
											}
										>
											<option value="SINGLE_CHOICE">Chọn một đáp án</option>
											<option value="MULTIPLE_CHOICE">Chọn nhiều đáp án</option>
										</select>
									</label>
									<p className="muted">
										Đánh dấu lựa chọn đúng. Giải thích cả đáp án sai để người học hiểu thêm.
									</p>
									{q.options.map((o, oi) => (
										<div className="option-editor" key={o.id || oi}>
											<label className="check-label">
												<input
													type={q.type === "SINGLE_CHOICE" ? "radio" : "checkbox"}
													name={`correct-${index}`}
													checked={Boolean(o.correct)}
													onChange={(e) =>
														editQuestion(index, {
															options: q.options.map((v, vi) =>
																q.type === "SINGLE_CHOICE"
																	? { ...v, correct: vi === oi }
																	: vi === oi
																		? { ...v, correct: e.target.checked }
																		: v,
															),
														})
													}
												/>
												Đúng
											</label>
											<div className="stack">
												<label>
													Lựa chọn {String.fromCharCode(65 + oi)}
													<Input
														value={o.text}
														onChange={(e) =>
															editQuestion(index, {
																options: q.options.map((v, vi) =>
																	vi === oi ? { ...v, text: e.target.value } : v,
																),
															})
														}
													/>
												</label>
												<div className="actions">
													<Button
														variant="ghost"
														size="icon"
														aria-label="Di chuyển lựa chọn lên"
														disabled={oi === 0}
														onClick={() =>
															editQuestion(index, { options: move(q.options, oi, -1) })
														}
													>
														<ArrowUp />
													</Button>
													<Button
														variant="ghost"
														size="icon"
														aria-label="Di chuyển lựa chọn xuống"
														disabled={oi === q.options.length - 1}
														onClick={() => editQuestion(index, { options: move(q.options, oi, 1) })}
													>
														<ArrowDown />
													</Button>
												</div>
												<label>
													Giải thích
													<Input
														value={o.explanation || ""}
														onChange={(e) =>
															editQuestion(index, {
																options: q.options.map((v, vi) =>
																	vi === oi ? { ...v, explanation: e.target.value } : v,
																),
															})
														}
													/>
												</label>
											</div>
											<Button
												variant="ghost"
												size="icon"
												aria-label="Xóa lựa chọn"
												onClick={() =>
													editQuestion(index, { options: q.options.filter((_, vi) => vi !== oi) })
												}
											>
												<Trash2 />
											</Button>
										</div>
									))}
									{q.options.length < 4 ? (
										<Button
											variant="outline"
											onClick={() =>
												editQuestion(index, {
													options: [...q.options, { text: "", correct: false, explanation: "" }],
												})
											}
										>
											<Plus />
											Thêm lựa chọn
										</Button>
									) : null}
									<MediaFields
										value={q.media}
										onChange={(media) => editQuestion(index, { media })}
									/>
								</div>
							) : null,
						)}
						<Button
							variant="outline"
							onClick={() => editItem({ questions: [...item.questions, newQuestion(activeStage)] })}
						>
							<Plus />
							Thêm biến thể câu hỏi
						</Button>
					</section>
				) : (
					<div className="panel">Thêm kiến thức để tạo câu hỏi.</div>
				)}
			</div>
		</>
	);
}
