"use client";
import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);
export function LandingMotion({ children }: { children: ReactNode }) {
	const ref = useRef<HTMLDivElement>(null);
	useGSAP(
		() => {
			const media = gsap.matchMedia();
			media.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
				gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
					gsap.from(el, {
						y: 20,
						opacity: 0,
						duration: 0.75,
						ease: "power2.out",
						scrollTrigger: { trigger: el, start: "top 92%", once: true },
					});
				});
				gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((el) => {
					gsap.from(el, {
						scale: 0.95,
						duration: 1.2,
						ease: "power2.out",
						scrollTrigger: { trigger: el, start: "top 90%", once: true },
					});
				});
			});
			return () => media.revert();
		},
		{ scope: ref },
	);
	return <div ref={ref}>{children}</div>;
}
