import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/providers/react-query";

export const metadata: Metadata = {
	title: "Starter App",
	description: "A maintainable application starter",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="min-h-screen bg-background text-foreground antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ReactQueryProvider>
						<TooltipProvider>
							<header className="border-b">
								<nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
									<Link href="/" className="font-semibold">
										Starter
									</Link>
									<div className="flex gap-4 text-sm">
										<Link href="/login">Sign in</Link>
										<Link href="/account">Account</Link>
									</div>
								</nav>
							</header>
							<main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center px-6 py-12">
								{children}
							</main>
							<Toaster />
						</TooltipProvider>
					</ReactQueryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
