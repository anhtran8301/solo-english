"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authApi, useAuth } from "@/features/auth";
import { initials } from "@/features/auth/initials";
import { ProfileForms } from "@/features/auth/profile-forms";
import { ErrorText, PageHeading, useAction } from "@/features/learning/shared";
import { ThemeSelect } from "@/features/shell/site-shell";
export default function AccountPage() {
	const auth = useAuth(),
		router = useRouter();
	const [error, setError] = useState<Error | null>(null),
		[busy, setBusy] = useState(false);
	const preferences = useAction("auth/me", "PATCH", () => {
		void auth.refetch();
	});
	return (
		<>
			<PageHeading title="Tài khoản của bạn" description="Không gian tự học mang tên bạn." />
			<section className="panel account-panel stack">
				<div className="account-avatar">{initials(auth.user?.name || "")}</div>
				<h2>{auth.user?.name}</h2>
				<dl className="account-details">
					<dt>Email</dt>
					<dd>{auth.user?.email}</dd>
					<dt>Múi giờ học</dt>
					<dd>{auth.user?.timezone}</dd>
				</dl>
				<ThemeSelect />
				<form
					className="stack"
					onSubmit={(e) => {
						e.preventDefault();
						preferences.mutate({ timezone: new FormData(e.currentTarget).get("timezone") });
					}}
				>
					<label>
						Múi giờ thống kê
						<input
							name="timezone"
							required
							defaultValue={auth.user?.timezone || "Asia/Ho_Chi_Minh"}
							list="timezones"
						/>
					</label>
					<datalist id="timezones">
						{[
							"Asia/Ho_Chi_Minh",
							"Asia/Tokyo",
							"Europe/London",
							"America/New_York",
							"Australia/Sydney",
							"UTC",
						].map((zone) => (
							<option key={zone} value={zone} />
						))}
					</datalist>
					<Button type="submit" disabled={preferences.isPending}>
						Lưu múi giờ
					</Button>
					<ErrorText error={preferences.error} />
					{preferences.isSuccess ? <p role="status">Đã cập nhật múi giờ.</p> : null}
				</form>
				<ErrorText error={error} />
				<Button
					variant="outline"
					disabled={busy}
					onClick={async () => {
						setBusy(true);
						try {
							await authApi.logout();
							await auth.clear();
							router.replace("/");
						} catch (e) {
							setError(e as Error);
							setBusy(false);
						}
					}}
				>
					{busy ? "Đang đăng xuất…" : "Đăng xuất"}
				</Button>
			</section>
			<ProfileForms />
		</>
	);
}
