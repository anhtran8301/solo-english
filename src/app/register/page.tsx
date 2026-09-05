import { AuthForm, GuestGuard } from "@/features/auth";
export default function RegisterPage() {
	return (
		<GuestGuard>
			<AuthForm mode="signup" />
		</GuestGuard>
	);
}
