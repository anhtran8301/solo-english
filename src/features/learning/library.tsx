"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { ArrowDown, ArrowUp, Folder, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api-client";
import { DataState, Empty, ErrorText, LessonCard, PageHeading, useAction, useData } from "./shared";
import type { Collection, Lesson } from "./types";

function SortButtons({
	kind,
	parentId,
	items,
	index,
}: {
	kind: "collections" | "topics" | "lessons";
	parentId?: string;
	items: { id: string }[];
	index: number;
}) {
	const action = useAction("collections/reorder", "POST");
	function move(delta: number) {
		const ids = items.map((item) => item.id);
		[ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
		action.mutate({ kind, parentId, ids });
	}
	return (
		<div className="actions">
			<Button
				variant="ghost"
				size="icon"
				aria-label="Di chuyển lên"
				disabled={index === 0 || action.isPending}
				onClick={() => move(-1)}
			>
				<ArrowUp />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				aria-label="Di chuyển xuống"
				disabled={index === items.length - 1 || action.isPending}
				onClick={() => move(1)}
			>
				<ArrowDown />
			</Button>
			<ErrorText error={action.error} />
		</div>
	);
}
function GroupForm({
	path,
	name,
	parentId,
	onDone,
	onSaved,
}: {
	path: string;
	name?: string;
	parentId?: string;
	onDone?: () => void;
	onSaved?: (group: { id: string }) => void;
}) {
	const action = useAction<{ id: string }>(path, name ? "PATCH" : "POST", (group) => {
		onSaved?.(group);
		onDone?.();
	});
	function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const values = new FormData(e.currentTarget);
		action.mutate({ name: values.get("name"), ...(parentId ? { collectionId: parentId } : {}) });
	}
	return (
		<form className="inline-form" onSubmit={submit}>
			<label>
				Tên {parentId ? "chủ đề" : "bộ sưu tập"}
				<Input
					name="name"
					maxLength={200}
					defaultValue={name}
					placeholder="Ví dụ: Tiếng Anh giao tiếp"
					required
					autoComplete="off"
				/>
			</label>
			<Button type="submit" disabled={action.isPending}>
				Lưu
			</Button>
			{onDone ? (
				<Button variant="ghost" onClick={onDone}>
					Hủy
				</Button>
			) : null}
			<ErrorText error={action.error} />
		</form>
	);
}
export function ImportDestination({
	collections,
	topicId,
	onSelect,
}: {
	collections: Collection[];
	topicId: string;
	onSelect: (id: string) => void;
}) {
	const [creating, setCreating] = useState(false);
	const [collectionId, setCollectionId] = useState("");
	const topics = collections.flatMap((collection) => collection.topics);
	const parentId = collections.some((collection) => collection.id === collectionId)
		? collectionId
		: collections[0]?.id || "";
	return (
		<div className="stack">
			{topics.length ? (
				<label>
					Chủ đề đích
					<select name="topicId" value={topicId} onChange={(event) => onSelect(event.target.value)}>
						<option value="">Chọn chủ đề</option>
						{collections.map((collection) => (
							<optgroup key={collection.id} label={collection.name}>
								{collection.topics.map((topic) => (
									<option key={topic.id} value={topic.id}>
										{topic.name}
									</option>
								))}
							</optgroup>
						))}
					</select>
				</label>
			) : (
				<p role="status">
					Chưa có chủ đề để lưu bài. Tạo bộ sưu tập và chủ đề ngay bên dưới; JSON đã nhập được giữ
					nguyên.
				</p>
			)}
			{!collections.length ? (
				<GroupForm path="collections" onSaved={(group) => setCollectionId(group.id)} />
			) : !topics.length || creating ? (
				<div className="stack">
					<label>
						Bộ sưu tập đích
						<select
							name="collectionId"
							value={parentId}
							onChange={(event) => setCollectionId(event.target.value)}
						>
							{collections.map((collection) => (
								<option key={collection.id} value={collection.id}>
									{collection.name}
								</option>
							))}
						</select>
					</label>
					<GroupForm
						key={parentId}
						path="topics"
						parentId={parentId}
						onDone={topics.length ? () => setCreating(false) : undefined}
						onSaved={(group) => onSelect(group.id)}
					/>
				</div>
			) : (
				<Button variant="outline" onClick={() => setCreating(true)}>
					<Plus />
					Tạo chủ đề mới
				</Button>
			)}
		</div>
	);
}
function DeleteButton({ path, label }: { path: string; label: string }) {
	const [confirm, setConfirm] = useState(false);
	const action = useAction(path, "DELETE", () => setConfirm(false));
	return (
		<>
			{confirm ? (
				<div className="confirm-inline" role="alert">
					<span>Xóa {label} và nội dung bên trong?</span>
					<Button
						variant="destructive"
						disabled={action.isPending}
						onClick={() => action.mutate(undefined)}
					>
						Xác nhận xóa
					</Button>
					<Button variant="ghost" onClick={() => setConfirm(false)}>
						Hủy
					</Button>
				</div>
			) : (
				<Button
					variant="ghost"
					size="icon"
					aria-label={`Xóa ${label}`}
					onClick={() => setConfirm(true)}
				>
					<Trash2 />
				</Button>
			)}
			<ErrorText error={action.error} />
		</>
	);
}
export function LibraryPage() {
	const query = useData<Collection[]>("collections"),
		params = useSearchParams(),
		router = useRouter();
	const [form, setForm] = useState("");
	const [importText, setImportText] = useState("");
	const [preview, setPreview] = useState<unknown>(null);
	const [importError, setImportError] = useState("");
	const [previewing, setPreviewing] = useState(false);
	const [topicId, setTopicId] = useState("");
	const imported = useAction<Lesson>("lessons/import", "POST", (l) =>
		router.push(`/lessons/${l.id}/edit`),
	);
	const search = params.get("search") || "";
	const collections = query.data || [],
		topics = collections.flatMap((c) => c.topics);
	const lessons = topics
		.flatMap((t) => t.lessons)
		.filter((l) => l.title.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi")));
	const destinationId = topics.some((topic) => topic.id === topicId) ? topicId : "";
	return (
		<>
			<PageHeading title="Thư viện của tôi" description="Kiến thức của bạn. Cách học của bạn.">
				<Button variant="outline" onClick={() => setForm(form === "import" ? "" : "import")}>
					Import JSON
				</Button>
				<Button asChild>
					<Link href="/lessons/new/edit">
						<Plus />
						Tạo bài học
					</Link>
				</Button>
			</PageHeading>
			<DataState loading={query.isLoading} error={query.error} retry={query.refetch}>
				<div className="library-toolbar">
					<label className="search-field">
						Tìm bài học
						<Input
							type="search"
							defaultValue={search}
							placeholder="Tìm theo tên bài…"
							onChange={(e) =>
								router.replace(`/library?search=${encodeURIComponent(e.target.value)}`, {
									scroll: false,
								})
							}
						/>
					</label>
					<Button
						variant="outline"
						onClick={() => setForm(form === "collection" ? "" : "collection")}
					>
						<Plus />
						Bộ sưu tập
					</Button>
				</div>
				{form === "collection" ? <GroupForm path="collections" onDone={() => setForm("")} /> : null}
				{form === "import" ? (
					<section className="panel stack">
						<h2>Đưa bài học vào thư viện</h2>
						<p>
							Tải file hoặc dán JSON, kiểm tra nội dung rồi import. Bài được lưu dưới dạng bản nháp.
						</p>
						<a className="text-link" href="/examples/greetings.json" download>
							Tải JSON mẫu
						</a>
						<label>
							Chọn file JSON
							<input
								type="file"
								accept=".json,application/json"
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (file) {
										if (file.size > 5 * 1024 * 1024) {
											setImportError("File tối đa 5 MB.");
											return;
										}
										setImportText(await file.text());
										setPreview(null);
									}
								}}
							/>
						</label>
						<label>
							Nội dung JSON
							<textarea
								rows={8}
								value={importText}
								onChange={(e) => {
									setImportText(e.target.value);
									setPreview(null);
								}}
								spellCheck={false}
							/>
						</label>
						<Button
							variant="outline"
							disabled={previewing}
							onClick={async () => {
								setPreviewing(true);
								try {
									const doc = JSON.parse(importText);
									if (
										doc.schemaVersion !== 1 ||
										!doc.lesson?.title ||
										!Array.isArray(doc.lesson?.knowledgeItems)
									)
										throw new Error("Cần schemaVersion: 1 và lesson có title, knowledgeItems.");
									setPreview(
										await apiRequest("lessons/import/preview", {
											method: "POST",
											body: JSON.stringify(doc),
										}),
									);
									setImportError("");
								} catch (e) {
									setImportError(e instanceof Error ? e.message : "JSON không hợp lệ.");
								} finally {
									setPreviewing(false);
								}
							}}
						>
							Xem trước
						</Button>
						{preview ? (
							<div className="import-preview">
								<strong>{(preview as { lesson: Lesson }).lesson.title}</strong>
								<p>{(preview as { lesson: Lesson }).lesson.knowledgeItems.length} kiến thức</p>
								<ImportDestination
									collections={collections}
									topicId={destinationId}
									onSelect={setTopicId}
								/>
								{!destinationId ? (
									<p className="muted">Chọn hoặc tạo chủ đề đích để bật nút Import bài học.</p>
								) : null}
								<Button
									disabled={!destinationId || imported.isPending}
									onClick={() => imported.mutate({ topicId: destinationId, document: preview })}
								>
									Import bài học
								</Button>
							</div>
						) : null}
						{importError ? (
							<p role="alert" className="error-text">
								{importError}
							</p>
						) : null}
						<ErrorText error={imported.error} />
					</section>
				) : null}
				{!collections.length ? (
					<Empty title="Một thư viện dành riêng cho bạn">
						<p>
							Tạo bộ sưu tập đầu tiên, thêm chủ đề rồi viết bài học. Hoặc khám phá bài được chia sẻ.
						</p>
						<Link className="text-link" href="/explore">
							Khám phá bài học <span aria-hidden="true">→</span>
						</Link>
					</Empty>
				) : (
					<>
						{collections.map((c, ci) => (
							<section key={c.id} className="collection-section">
								<div className="section-title">
									<h2>
										<Folder size={22} />
										{c.name}
									</h2>
									<div className="actions">
										<Button
											variant="ghost"
											size="icon"
											aria-label={`Đổi tên ${c.name}`}
											onClick={() => setForm(c.id)}
										>
											<Pencil />
										</Button>
										<DeleteButton path={`collections/${c.id}`} label={c.name} />
										<SortButtons kind="collections" items={collections} index={ci} />
										<Button variant="outline" onClick={() => setForm(`topic-${c.id}`)}>
											<Plus />
											Chủ đề
										</Button>
									</div>
								</div>
								{form === c.id ? (
									<GroupForm
										path={`collections/${c.id}`}
										name={c.name}
										onDone={() => setForm("")}
									/>
								) : null}
								{form === `topic-${c.id}` ? (
									<GroupForm path="topics" parentId={c.id} onDone={() => setForm("")} />
								) : null}
								{c.topics.length ? (
									c.topics.map((t, ti) => (
										<div className="topic-section" key={t.id}>
											<div className="section-title">
												<h3>{t.name}</h3>
												<div className="actions">
													<Button
														variant="ghost"
														size="icon"
														aria-label={`Đổi tên ${t.name}`}
														onClick={() => setForm(t.id)}
													>
														<Pencil />
													</Button>
													<DeleteButton path={`topics/${t.id}`} label={t.name} />
													<SortButtons kind="topics" parentId={c.id} items={c.topics} index={ti} />
													<Link className="text-link" href={`/lessons/new/edit?topic=${t.id}`}>
														Thêm bài
													</Link>
												</div>
											</div>
											{form === t.id ? (
												<GroupForm
													path={`topics/${t.id}`}
													parentId={c.id}
													name={t.name}
													onDone={() => setForm("")}
												/>
											) : null}
											<div className="lesson-grid">
												{t.lessons
													.filter((l) => lessons.some((v) => v.id === l.id))
													.map((l) => (
														<div key={l.id}>
															<LessonCard lesson={l} />
															<SortButtons
																kind="lessons"
																parentId={t.id}
																items={t.lessons}
																index={t.lessons.findIndex((item) => item.id === l.id)}
															/>
														</div>
													))}
											</div>
											{!t.lessons.length ? (
												<p className="muted">Chưa có bài học trong chủ đề này.</p>
											) : null}
										</div>
									))
								) : (
									<p className="muted">Thêm chủ đề để bắt đầu tổ chức bài học.</p>
								)}
							</section>
						))}
						{search && !lessons.length ? (
							<Empty title="Không tìm thấy bài phù hợp">
								<p>Thử một từ khóa khác.</p>
							</Empty>
						) : null}
					</>
				)}
			</DataState>
		</>
	);
}
