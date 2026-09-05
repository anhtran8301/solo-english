"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthGuard, authApi, useAuth } from "@/features/auth";
export default function AccountPage() {
	const auth = useAuth();
	const router = useRouter();
	return (
		<AuthGuard>
			<section className="w-full max-w-md space-y-4 rounded-xl border p-6">
				<h1 className="font-semibold text-2xl">Account</h1>
				<dl className="grid grid-cols-[auto_1fr] gap-3 text-sm">
					<dt className="text-muted-foreground">Name</dt>
					<dd>{auth.user?.name}</dd>
					<dt className="text-muted-foreground">Email</dt>
					<dd>{auth.user?.email}</dd>
				</dl>
				<Button
					variant="outline"
					onClick={async () => {
						await authApi.logout();
						auth.clear();
						router.replace("/");
					}}
				>
					Sign out
				</Button>
			</section>
		</AuthGuard>
	);
}
