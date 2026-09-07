"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorText } from "@/features/learning/shared";
import { authClient } from "./api";
import { useAuth } from "./use-auth";

export function ProfileForms() {
	const auth = useAuth();
	const [profileError, setProfileError] = useState<Error | null>(null);
	const [profileBusy, setProfileBusy] = useState(false);
	const [profileSaved, setProfileSaved] = useState(false);
	const [passwordError, setPasswordError] = useState<Error | null>(null);
	const [passwordBusy, setPasswordBusy] = useState(false);
	const [passwordSaved, setPasswordSaved] = useState(false);
	return (
		<div className="profile-grid">
			<form
				className="panel stack"
				onSubmit={async (event) => {
					event.preventDefault();
					if (profileBusy) return;
					const name = String(new FormData(event.currentTarget).get("name") || "").trim();
					setProfileSaved(false);
					setProfileError(null);
					if (!name) {
						setProfileError(new Error("Vui lòng nhập tên hiển thị."));
						return;
					}
					setProfileBusy(true);
					try {
						const result = await authClient.updateUser({ name });
						if (result.error) throw new Error("Chưa cập nhật được hồ sơ. Vui lòng thử lại.");
						await auth.refetch();
						setProfileSaved(true);
					} catch (error) {
						setProfileError(
							error instanceof Error ? error : new Error("Không kết nối được máy chủ."),
						);
					} finally {
						setProfileBusy(false);
					}
				}}
			>
				<h2>Thông tin cá nhân</h2>
				<label>
					Tên hiển thị
					<Input
						name="name"
						autoComplete="name"
						defaultValue={auth.user?.name}
						required
						maxLength={100}
					/>
				</label>
				<label>
					Email
					<Input type="email" value={auth.user?.email || ""} readOnly autoComplete="email" />
				</label>
				<p className="muted">Email đăng nhập chưa hỗ trợ thay đổi tại đây.</p>
				<ErrorText error={profileError} />
				{profileSaved ? <p role="status">Đã cập nhật hồ sơ.</p> : null}
				<Button type="submit" disabled={profileBusy}>
					{profileBusy ? "Đang lưu…" : "Lưu hồ sơ"}
				</Button>
			</form>
			<form
				className="panel stack"
				onSubmit={async (event) => {
					event.preventDefault();
					if (passwordBusy) return;
					const form = event.currentTarget,
						values = new FormData(form);
					const currentPassword = String(values.get("currentPassword")),
						newPassword = String(values.get("newPassword"));
					setPasswordError(null);
					setPasswordSaved(false);
					if (newPassword !== values.get("confirmPassword")) {
						setPasswordError(new Error("Hai mật khẩu mới chưa khớp."));
						return;
					}
					setPasswordBusy(true);
					try {
						const result = await authClient.changePassword({
							currentPassword,
							newPassword,
							revokeOtherSessions: true,
						});
						if (result.error)
							throw new Error(
								result.error.code === "INVALID_PASSWORD"
									? "Mật khẩu hiện tại chưa đúng."
									: "Chưa đổi được mật khẩu. Kiểm tra thông tin rồi thử lại.",
							);
						form.reset();
						setPasswordSaved(true);
					} catch (error) {
						setPasswordError(
							error instanceof Error ? error : new Error("Không kết nối được máy chủ."),
						);
					} finally {
						setPasswordBusy(false);
					}
				}}
			>
				<h2>Đổi mật khẩu</h2>
				<label>
					Mật khẩu hiện tại
					<Input name="currentPassword" type="password" autoComplete="current-password" required />
				</label>
				<label>
					Mật khẩu mới
					<Input
						name="newPassword"
						type="password"
						autoComplete="new-password"
						minLength={8}
						maxLength={128}
						required
					/>
				</label>
				<label>
					Nhập lại mật khẩu mới
					<Input
						name="confirmPassword"
						type="password"
						autoComplete="new-password"
						minLength={8}
						maxLength={128}
						required
					/>
				</label>
				<p className="muted">
					Dùng ít nhất 8 ký tự. Đổi mật khẩu sẽ đăng xuất các phiên trên thiết bị khác.
				</p>
				<ErrorText error={passwordError} />
				{passwordSaved ? <p role="status">Đã đổi mật khẩu.</p> : null}
				<Button type="submit" disabled={passwordBusy}>
					{passwordBusy ? "Đang cập nhật…" : "Đổi mật khẩu"}
				</Button>
			</form>
		</div>
	);
}
