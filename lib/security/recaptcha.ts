/**
 * Server-side check of a reCAPTCHA v2 ("I'm not a robot") token.
 *
 * Until RECAPTCHA_SECRET_KEY is set the check is skipped, so the forms keep
 * working while the keys are being set up. Once it is set, every guarded form
 * needs a token Google accepts.
 */

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

let warnedMissing = false;

export function isRecaptchaConfigured(): boolean {
  return Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim());
}

export async function verifyRecaptcha(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    if (!warnedMissing && process.env.NODE_ENV === "production") {
      console.warn("[recaptcha] RECAPTCHA_SECRET_KEY is not set, skipping the check");
      warnedMissing = true;
    }
    return true;
  }

  if (!token || token.length > 4000) return false;

  const params = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") params.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: params,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[recaptcha] verify returned", res.status);
      return false;
    }
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return data.success === true;
  } catch (err) {
    // Fail closed: with the secret set, a form only goes through when Google
    // has vouched for it.
    console.error("[recaptcha] verify failed", err);
    return false;
  }
}
