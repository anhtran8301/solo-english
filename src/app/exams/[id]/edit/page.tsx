import { Suspense } from "react";
import { ExamEditor } from "@/features/learning/exams";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<ExamEditor id={id} />
		</Suspense>
	);
}
