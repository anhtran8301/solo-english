import { Suspense } from "react";
import { ProgressPage } from "@/features/learning/dashboard";
export default function Page() {
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<ProgressPage />
		</Suspense>
	);
}
