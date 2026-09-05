import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
	return (
		<section className="max-w-xl space-y-6 text-center">
			<p className="text-muted-foreground text-sm uppercase tracking-widest">Ready to build</p>
			<h1 className="font-semibold text-5xl tracking-tight">
				A clean foundation for your next product.
			</h1>
			<p className="text-lg text-muted-foreground">
				Next.js, typed API access, reusable UI primitives and cookie authentication—without legacy
				product logic.
			</p>
			<Button asChild>
				<Link href="/register">Create account</Link>
			</Button>
		</section>
	);
}
