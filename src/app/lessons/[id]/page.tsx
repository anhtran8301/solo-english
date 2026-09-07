import { Suspense } from "react";
import { LessonDetail } from "@/features/learning/lesson-detail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<LessonDetail id={id} />
		</Suspense>
	);
}
