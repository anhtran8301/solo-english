import { Spinner } from "@/components/ui/spinner";

type Props = {
	children?: React.ReactNode;
};

export function LoadingPage({ children }: Props) {
	return (
		<div className="fixed inset-0 z-999 flex flex-col items-center justify-center gap-4 bg-background">
			<Spinner className="size-7" />
			{children}
		</div>
	);
}
