import { Suspense } from "react";
import { DashboardPage } from "@/features/learning/dashboard";
export default function Page() {
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<DashboardPage />
		</Suspense>
	);
}
