import { Suspense } from "react";
import { LearningPlayer } from "@/features/learning/players";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<LearningPlayer id={id} />
		</Suspense>
	);
}
