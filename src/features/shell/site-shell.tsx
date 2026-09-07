"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import {
	BookOpen,
	ChartNoAxesCombined,
	ClipboardCheck,
	Compass,
	LayoutDashboard,
	Menu,
	NotebookPen,
	RotateCcw,
	UserRound,
	X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/features/auth/guards";
import { initials } from "@/features/auth/initials";
import { useAuth } from "@/features/auth/use-auth";

const navigation = [
	["/guide", "Hướng dẫn", BookOpen],
	["/dashboard", "Hôm nay", LayoutDashboard],
	["/library", "Thư viện của tôi", BookOpen],
	["/review", "Ôn tập", RotateCcw],
	["/mistakes", "Sổ lỗi sai", NotebookPen],
	["/explore", "Khám phá", Compass],
	["/exams", "Bài kiểm tra", ClipboardCheck],
	["/progress", "Tiến độ", ChartNoAxesCombined],
] as const;
export function ThemeSelect() {
	const { theme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		subscribeTheme,
		() => true,
		() => false,
	);
	return (
		<label className="theme-select">
			<span>Giao diện</span>
			<select
				value={mounted ? theme || "system" : "system"}
				aria-label="Chế độ giao diện"
				onChange={(e) => setTheme(e.target.value)}
			>
				<option value="system">Hệ thống</option>
				<option value="light">Sáng</option>
				<option value="dark">Tối</option>
			</select>
		</label>
	);
}
const subscribeTheme = () => () => {};
const subscribeNetwork = (update: () => void) => {
	window.addEventListener("online", update);
	window.addEventListener("offline", update);
	return () => {
		window.removeEventListener("online", update);
		window.removeEventListener("offline", update);
	};
};
export function Brand() {
	return (
		<Link href="/" className="brand">
			<span className="brand-mark">
				<BookOpen size={20} strokeWidth={1.8} aria-hidden="true" />
			</span>
			solo<span className="brand-light">english</span>
		</Link>
	);
}
function AccountLink() {
	const auth = useAuth();
	if (auth.loading) return <span className="user-avatar" aria-label="Đang tải tài khoản" />;
	return auth.user ? (
		<Link
			className="user-avatar"
			href="/account"
			aria-label={`Hồ sơ của ${auth.user.name}`}
			title={auth.user.name}
		>
			{initials(auth.user.name)}
		</Link>
	) : (
		<Link href="/login">Đăng nhập</Link>
	);
}
export function SiteShell({ children }: { children: ReactNode }) {
	const auth = useAuth();
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const online = useSyncExternalStore(
		subscribeNetwork,
		() => navigator.onLine,
		() => true,
	);
	const publicPage = pathname === "/" || pathname === "/login" || pathname === "/register";
	const explore = pathname.startsWith("/explore");
	const player = pathname.startsWith("/learn/") || pathname.startsWith("/exam-attempts/");
	if (publicPage)
		return (
			<>
				<a className="skip-link" href="#main-content">
					Đến nội dung chính
				</a>
				<header className="public-header">
					<Brand />
					<nav>
						<Link href="/explore">Khám phá bài học</Link>
						<Link href="/guide">Hướng dẫn</Link>
						<Button asChild>
							<Link href={auth.user ? "/dashboard" : "/register"}>
								{auth.user ? "Học tiếp" : "Bắt đầu học"}
							</Link>
						</Button>
						<AccountLink />
					</nav>
				</header>
				<main id="main-content" className={pathname === "/" ? "landing" : "auth-page"}>
					{children}
				</main>
				<footer className="public-footer">
					<span>Solo English. Một chút mỗi ngày.</span>
					<ThemeSelect />
				</footer>
			</>
		);
	const body = (
		<>
			<a className="skip-link" href="#main-content">
				Đến nội dung chính
			</a>
			<header className="mobile-header">
				<Brand />
				<Button
					variant="ghost"
					size="icon"
					aria-label={open ? "Đóng menu" : "Mở menu"}
					aria-expanded={open}
					onClick={() => setOpen(!open)}
				>
					{open ? <X /> : <Menu />}
				</Button>
				<AccountLink />
			</header>
			<aside className={`sidebar ${open ? "is-open" : ""}`}>
				<Brand />
				<p className="sidebar-label">KHÔNG GIAN HỌC CỦA BẠN</p>
				<nav>
					{navigation.map(([href, label, Icon]) => (
						<Link
							onClick={() => setOpen(false)}
							className={pathname.startsWith(href) ? "nav-item active" : "nav-item"}
							key={href}
							href={href}
						>
							<Icon size={19} strokeWidth={1.7} aria-hidden="true" />
							{label}
						</Link>
					))}
				</nav>
				<div className="sidebar-bottom">
					<div className="small-note">
						Mỗi lần quay lại,
						<br />
						bạn nhớ thêm một chút.
					</div>
					<Link className="nav-item" href="/account" onClick={() => setOpen(false)}>
						<UserRound size={19} aria-hidden="true" />
						Tài khoản
					</Link>
					<ThemeSelect />
				</div>
			</aside>
			<main id="main-content" className={`app-main ${player ? "player-main" : ""}`}>
				<div className="app-account-bar">
					<AccountLink />
				</div>
				{!online ? (
					<p role="status" className="notice">
						Đang ngoại tuyến. Giữ trang mở để không mất dữ liệu chưa lưu; thao tác chờ sẽ tiếp tục
						khi có mạng.
					</p>
				) : null}
				{children}
			</main>
		</>
	);
	return explore || pathname === "/guide" ? body : <AuthGuard>{body}</AuthGuard>;
}
