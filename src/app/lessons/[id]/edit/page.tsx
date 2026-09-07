import { Suspense } from "react";
import { LessonEditor } from "@/features/learning/editor";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<LessonEditor id={id} />
		</Suspense>
	);
}
