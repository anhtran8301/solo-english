import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "priority" | "loading"> & {
	srcLight: string;
	srcDark: string;
};

export const ThemeImage = (props: Props) => {
	const { srcLight, srcDark, className, alt = "Image placeholder", ...rest } = props;
	return (
		<>
			<Image alt={alt} {...rest} src={srcLight} className={cn("dark:hidden", className)} />
			<Image
				alt={alt}
				{...rest}
				src={srcDark}
				className={cn("hidden dark:[display:unset]", className)}
			/>
		</>
	);
};
