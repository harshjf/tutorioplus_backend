export function normalizeToE164(raw: string, defaultCountryCode: string): string {
	const digits = raw.replace(/[^\d+]/g, "");
	if (digits.startsWith("+")) {
		return digits;
	}
	if (digits.startsWith("0")) {
		return `+${defaultCountryCode}${digits.slice(1)}`;
	}
	return `+${defaultCountryCode}${digits}`;
}