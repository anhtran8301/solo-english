import { Suspense } from "react";
import { ReviewPage } from "@/features/learning/review";
export default function Page() {
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<ReviewPage />
		</Suspense>
	);
}
