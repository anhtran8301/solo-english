import { Suspense } from "react";
import { LibraryPage } from "@/features/learning/library";
export default function Page() {
	return (
		<Suspense fallback={<div className="skeleton-page" />}>
			<LibraryPage />
		</Suspense>
	);
}
