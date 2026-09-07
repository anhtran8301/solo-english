import { Suspense } from "react";
import { ExamPlayer } from "@/features/learning/players";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<ExamPlayer id={id} />
		</Suspense>
	);
}
