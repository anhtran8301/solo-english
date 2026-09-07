export function initials(name: string) {
	return (
		name
			.trim()
			.split(/\s+/)
			.filter(Boolean)
			.slice(-2)
			.map((word) => Array.from(word)[0])
			.join("")
			.toLocaleUpperCase("vi-VN") || "U"
	);
}
