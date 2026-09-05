import { cn } from "@/lib/utils";

interface Props {
	className?: string;
	delay?: number;
	duration?: number;
}

export const DotLoader = ({ className }: Props) => {
	return (
		<div
			className={cn(
				"flex items-center justify-center space-x-1",
				"*:size-1.5 *:animate-dot-loader *:rounded-full *:bg-foreground",
				className,
			)}
		>
			<span className="sr-only">Loading...</span>
			<div className="delay-[-0.3s]!" />
			<div className="delay-[-0.15s]!" />
			<div className="delay-[0s]!" />
		</div>
	);
};
