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

/**
 * Sends through Resend's REST API directly rather than their SDK — one fetch
 * call does not justify another dependency.
 */
async function deliver(email: Email): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
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

  // Resend's shared sender works without a verified domain, which is what lets
  // this run before crimsondeli.com DNS is set up.
  const from = process.env.RESEND_FROM || "Crimson Deli <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email.to],
      subject: email.subject,
      text: email.text,
    }),
  });

  if (!res.ok) {
    // The body carries Resend's reason (unverified domain, bad key, and so on)
    // and the caller logs it — without this the failure is invisible.
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend rejected the email (${res.status}): ${detail.slice(0, 300)}`);
  }
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
