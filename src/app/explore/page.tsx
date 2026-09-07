import { Suspense } from "react";
import { ExplorePage } from "@/features/learning/explore";
export default function Page() {
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<ExplorePage />
		</Suspense>
	);
}
