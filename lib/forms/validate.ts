/**
 * Field rules shared by every form on the site, so a phone number or an email
 * address is judged the same way on the contact form, sign up and checkout.
 * Pure functions: safe to import on the client and the server.
 */

/** name@domain.tld, with a real top-level domain (at least two letters). */
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function isEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && EMAIL_RE.test(v) && !v.includes("..");
}

/**
 * What a phone field may hold while someone types: digits only, and no more
 * than a US number needs (10, or 11 with a leading country code 1). Pasting
 * "(215) 555-0123" or "+1 215 555 0123" keeps just the digits.
 */
export function cleanPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.slice(0, digits.startsWith("1") ? 11 : 10);
}

export function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (/[^\d\s()+.-]/.test(value)) return false;
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

type Rule = { required?: boolean; label?: string };

export function emailError(value: string, { required = true }: Rule = {}): string | undefined {
  if (!value.trim()) return required ? "Please enter your email address." : undefined;
  if (!isEmail(value)) return "Please enter a valid email, like name@example.com.";
}

export function phoneError(value: string, { required = true }: Rule = {}): string | undefined {
  if (!value.trim()) return required ? "Please enter your phone number." : undefined;
  if (!isPhone(value)) return "Please enter a 10-digit phone number.";
}

export function requiredError(value: string, message: string): string | undefined {
  if (!value.trim()) return message;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}
