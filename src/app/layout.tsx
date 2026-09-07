import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteShell } from "@/features/shell/site-shell";
import { ReactQueryProvider } from "@/providers/react-query";

const geist = Geist({
	subsets: ["latin", "vietnamese"],
	variable: "--font-geist",
	display: "swap",
});
export const metadata: Metadata = {
	title: { default: "Solo English", template: "%s | Solo English" },
	description: "Tự tạo bài học. Học ngắn mỗi ngày. Nhớ tiếng Anh lâu hơn.",
};
export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
		{ media: "(prefers-color-scheme: dark)", color: "#171719" },
	],
};
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="vi" suppressHydrationWarning>
			<body className={geist.variable}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ReactQueryProvider>
						<TooltipProvider>
							<SiteShell>{children}</SiteShell>
							<Toaster />
						</TooltipProvider>
					</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
