import { AuthForm, GuestGuard } from "@/features/auth";
export default function LoginPage() {
	return (
		<GuestGuard>
			<AuthForm mode="login" />
		</GuestGuard>
	);
}
