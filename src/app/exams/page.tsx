import { Suspense } from "react";
import { ExamsPage } from "@/features/learning/exams";
export default function Page() {
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<ExamsPage />
		</Suspense>
	);
}
