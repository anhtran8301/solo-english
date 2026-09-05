export function toNonAccentVietnamese(text: string) {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[đĐ]/g, (m) => (m === "đ" ? "d" : "D"));
}

export function generateSlug(text: string) {
	return toNonAccentVietnamese(text)
		.replace(/^\s+|\s+$/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

export function toLowerCaseNonAccentVietnamese(str: string) {
	return toNonAccentVietnamese(str.toLowerCase());
}

export function normalizeString(str: string) {
	return str
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase();
}

export function maskEmail(email: string): string {
	const [username, domain] = email.split("@");

	if (!username || !domain) return email;

	const visible = username.slice(0, 2);
	const masked = "*".repeat(Math.max(username.length - 2, 0));

	return `${visible}${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
	const cleanPhone = phone.replace(/\D/g, "");

	if (cleanPhone.length <= 5) return phone;

	const start = cleanPhone.slice(0, 3);
	const end = cleanPhone.slice(-2);
	const masked = "*".repeat(cleanPhone.length - 5);

	return `${start}${masked}${end}`;
}
