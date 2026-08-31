import { siteConfig } from "@/lib/site-config";

/**
 * Outbound email — interim implementation.
 *
 * The site has no mail provider wired yet (the contact form still hands off to
 * the visitor's own client via `mailto:`). Until Resend or SendGrid is put
 * behind a Cloud Function, this logs the message to the server console so the
 * reset flow is testable end to end in development.
 *
 * To go live, implement `deliver()` against the provider and nothing else in
 * the reset flow needs to change.
 */

type Email = {
  to: string;
  subject: string;
  text: string;
};

/** True once a provider is configured — the flow warns loudly when it is not. */
export function mailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function deliver(email: Email): Promise<void> {
  if (!mailerConfigured()) {
    // Dev fallback. Deliberately noisy: a silent no-op here would look like a
    // working reset flow while every email vanished.
    console.warn(
      [
        "",
        "──────────────────────────────────────────────────────────────",
        " EMAIL NOT SENT — no mail provider configured (RESEND_API_KEY).",
        ` To:      ${email.to}`,
        ` Subject: ${email.subject}`,
        "",
        email.text,
        "──────────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  // TODO: real provider. Shape kept close to Resend's REST API so wiring it up
  // is a matter of dropping in the fetch below and testing.
  throw new Error("RESEND_API_KEY is set but the provider is not implemented yet.");
}

export async function sendPasswordResetEmail(input: {
  to: string;
  name: string;
  resetUrl: string;
}): Promise<void> {
  const first = input.name.trim().split(/\s+/)[0] || "there";

  await deliver({
    to: input.to,
    subject: `Reset your ${siteConfig.name} password`,
    text: [
      `Hi ${first},`,
      "",
      `Someone asked to reset the password for your ${siteConfig.name} account.`,
      "Open the link below to choose a new one. It expires in one hour and can",
      "only be used once.",
      "",
      input.resetUrl,
      "",
      "If this wasn't you, you can ignore this email — your password stays as",
      "it is.",
      "",
      `${siteConfig.name} · ${siteConfig.address} · ${siteConfig.phone}`,
    ].join("\n"),
  });
}
