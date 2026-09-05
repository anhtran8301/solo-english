import Link from "next/link";
export default function NotFound() {
	return (
		<div className="text-center">
			<h1 className="font-semibold text-4xl">404</h1>
			<Link className="underline" href="/">
				Return home
			</Link>
		</div>
	);
}
