export const STAGES = ["LEARN", "USE", "RECALL", "EXPAND"] as const;
export const TYPES = [
	"VOCABULARY",
	"GRAMMAR",
	"PHRASE",
	"SENTENCE_PATTERN",
	"COLLOCATION",
] as const;
export const TYPE_LABELS: Record<string, string> = {
	VOCABULARY: "Từ vựng",
	GRAMMAR: "Ngữ pháp",
	PHRASE: "Cụm từ",
	SENTENCE_PATTERN: "Mẫu câu",
	COLLOCATION: "Collocation",
};
export const STATUS_LABELS: Record<string, string> = {
	NEW: "Chưa học",
	LEARNING: "Đang học",
	WEAK: "Cần luyện thêm",
	REVIEWING: "Đang ôn lại",
	MASTERED: "Đã ghi nhớ",
};
export type Media = { imageUrl?: string; audioUrl?: string; description: string } | null;
export type Option = { id?: string; text: string; correct?: boolean; explanation?: string };
export type Question = {
	id?: string;
	stage: (typeof STAGES)[number];
	type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
	prompt: string;
	media?: Media;
	options: Option[];
	knowledgeItemId?: string;
	term?: string;
};
export type Knowledge = {
	id?: string;
	term: string;
	meaning: string;
	type: (typeof TYPES)[number];
	media?: Media;
	questions: Question[];
};
export type PlayerQuestion = Omit<Question, "id" | "options"> & {
	id: string;
	options: (Option & { id: string })[];
};
export type Lesson = {
	id: string;
	topicId: string;
	title: string;
	description: string;
	visibility: "DRAFT" | "PRIVATE" | "PUBLIC";
	version: number;
	completed?: boolean;
	position?: number;
	knowledgeItems: Knowledge[];
	sourceAuthor?: string | null;
	owner?: { name: string };
	_count?: { knowledgeItems: number };
};
export type Topic = {
	id: string;
	collectionId: string;
	name: string;
	position: number;
	lessons: Lesson[];
};
export type Collection = { id: string; name: string; position: number; topics: Topic[] };
export type ProgressItem = {
	id: string;
	term: string;
	meaning: string;
	type: string;
	lessonId: string;
	lesson: { title: string; id: string };
	status: string;
	seen: number;
	correct: number;
	wrong: number;
	accuracy: number;
	saved: boolean;
	needsReview: boolean;
	lastSeenAt: string | null;
};
export type Answer = {
	questionId: string;
	knowledgeItemId: string;
	selected: string[];
	correct: boolean;
	stage: string;
	at: string;
};
export type LearningSession = {
	id: string;
	lessonId?: string;
	kind: string;
	title: string;
	stage: string;
	completedStages: string[];
	answered: Answer[];
	question: PlayerQuestion | null;
	stageDone: boolean;
	completedAt: string | null;
	total: number;
	correct: number;
	accuracy: number;
	duration: number;
	createdAt: string;
	feedback?: Answer & { question: PlayerQuestion };
};
export type Attempt = {
	id: string;
	examId: string;
	version: number;
	title: string;
	questions: PlayerQuestion[];
	answers: Record<string, string[]>;
	score?: number;
	accuracy?: number;
	submittedAt: string | null;
	duration: number;
	improvement?: number | null;
	createdAt: string;
};
export type Exam = {
	id: string;
	title: string;
	version: number;
	questions: Question[];
	attempts: Attempt[];
};
export type Daily = {
	date?: string;
	questions: number;
	correct: number;
	accuracy: number;
	seconds: number;
	knowledge: number;
	sessions: number;
};
export type Dashboard = {
	today: Daily;
	daily: (Daily & { date: string })[];
	week: (Daily & { date: string })[];
	streak: number;
	totalKnowledge: number;
	mastered: number;
	reviewCount: number;
	continueSession: LearningSession | null;
	sessions: LearningSession[];
};
export type PageResult<T> = {
	items: T[];
	meta: { page: number; limit: number; total: number; total_pages: number };
};
