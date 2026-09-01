import type { Order } from "@/lib/orders/types";
import { siteConfig } from "@/lib/site-config";

type Email = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

const DEFAULT_FROM = "Crimson Deli <no-reply@crimsondeli.com>";
const BRAND = "#900000";
const BRAND_DARK = "#6b0000";
const BRAND_LIGHT = "#fef2f2";
const INK = "#141414";
const MUTED = "#6b6b6b";
const BORDER = "#e5e0d8";
const CREAM = "#f7f4ef";
const WHITE = "#ffffff";

/** True once a provider is configured — the flow warns loudly when it is not. */
export function mailerConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

function logoUrl(): string {
  return `${siteUrl()}/assets/img/logo/crimson-logo-dark.webp`;
}

/** Where new-order alerts go. Defaults to the store inbox. */
export function orderNotificationEmail(): string {
  const configured = process.env.ORDER_NOTIFY_EMAIL?.trim();
  return configured || siteConfig.email;
}

function resendFrom(): string {
  return process.env.RESEND_FROM?.trim() || DEFAULT_FROM;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "America/New_York",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusLabel(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Shared wrapper — logo, crimson band, body, footer. */
function emailLayout(title: string, bodyHtml: string): string {
  const logo = logoUrl();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};line-height:1.5;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${esc(title)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${WHITE};border:1px solid ${BORDER};border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(20,20,20,0.08);">
          <tr>
            <td style="padding:28px 32px 20px;text-align:center;background:${WHITE};">
              <img src="${esc(logo)}" alt="${esc(siteConfig.name)}" width="140" height="48" style="display:block;margin:0 auto;height:48px;width:auto;max-width:180px;border:0;" />
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:linear-gradient(90deg,${BRAND_DARK} 0%,${BRAND} 50%,${BRAND_DARK} 100%);line-height:4px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px;background:${CREAM};border-top:1px solid ${BORDER};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:${INK};">${esc(siteConfig.name)}</p>
                    <p style="margin:0 0 4px;font-size:13px;color:${MUTED};line-height:1.6;">${esc(siteConfig.address)}</p>
                    <p style="margin:0;font-size:13px;color:${MUTED};">
                      <a href="${esc(siteConfig.phoneHref)}" style="color:${BRAND};text-decoration:none;font-weight:600;">${esc(siteConfig.phone)}</a>
                      <span style="color:${BORDER};"> &nbsp;|&nbsp; </span>
                      <a href="mailto:${esc(siteConfig.email)}" style="color:${BRAND};text-decoration:none;font-weight:600;">${esc(siteConfig.email)}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:11px;color:${MUTED};text-align:center;line-height:1.5;">
          Pickup only · Ogontz Avenue · ${esc(siteConfig.name)}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function primaryButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
  <tr>
    <td align="center" style="border-radius:10px;background:linear-gradient(180deg,${BRAND} 0%,${BRAND_DARK} 100%);">
      <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 32px;font-size:15px;font-weight:700;color:#fff;text-decoration:none;border-radius:10px;mso-padding-alt:0;">${esc(label)}</a>
    </td>
  </tr>
</table>`;
}

function ghostButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0;">
  <tr>
    <td align="center" style="border-radius:10px;border:2px solid ${BRAND};">
      <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:13px 24px;font-size:14px;font-weight:700;color:${BRAND};text-decoration:none;border-radius:8px;">${esc(label)}</a>
    </td>
  </tr>
</table>`;
}

function sectionLabel(text: string): string {
  return `<p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">${esc(text)}</p>`;
}

function statusBadge(status: string): string {
  return `<span style="display:inline-block;padding:6px 14px;background:${BRAND_LIGHT};color:${BRAND};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;border-radius:999px;border:1px solid rgba(144,0,0,0.15);">${esc(statusLabel(status))}</span>`;
}

/**
 * Sends through Resend's REST API directly rather than their SDK — one fetch
 * call does not justify another dependency.
 */
async function deliver(email: Email): Promise<void> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.warn(
      [
        "",
        "──────────────────────────────────────────────────────────────",
        " EMAIL NOT SENT — no mail provider configured (RESEND_API_KEY).",
        ` To:      ${Array.isArray(email.to) ? email.to.join(", ") : email.to}`,
        ` Subject: ${email.subject}`,
        "",
        email.text,
        "──────────────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  const to = Array.isArray(email.to) ? email.to : [email.to];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom(),
      to,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!res.ok) {
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

  const text = [
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
  ].join("\n");

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="52" valign="top">
          <div style="width:48px;height:48px;border-radius:12px;background:${BRAND_LIGHT};text-align:center;line-height:48px;font-size:22px;color:${BRAND};">🔒</div>
        </td>
        <td valign="top" style="padding-left:4px;">
          <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:${INK};line-height:1.25;">Reset your password</h2>
          <p style="margin:0;font-size:15px;color:${MUTED};">Hi ${esc(first)}, we received a request to update your account.</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:${CREAM};border-radius:12px;border:1px solid ${BORDER};">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0;font-size:14px;color:${INK};line-height:1.6;">
            Tap the button below to choose a new password for your <strong>${esc(siteConfig.name)}</strong> account.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:14px 18px;background:${BRAND_LIGHT};border-radius:10px;border-left:4px solid ${BRAND};">
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.5;">
            <strong style="color:${INK};">⏱ One hour only</strong> · This link works once. After that, request a new reset from the login page.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          ${primaryButton(input.resetUrl, "Choose a new password")}
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 0;font-size:13px;color:${MUTED};text-align:center;line-height:1.6;">
      Didn't ask for this? Ignore this email — your password will stay the same.
    </p>`;

  await deliver({
    to: input.to,
    subject: `Reset your ${siteConfig.name} password`,
    text,
    html: emailLayout("Reset your password", bodyHtml),
  });
}

/** Six-digit code emailed after email/password signup. */
export async function sendEmailVerificationEmail(input: {
  to: string;
  name: string;
  code: string;
}): Promise<void> {
  const first = input.name.trim().split(/\s+/)[0] || "there";

  const text = [
    `Hi ${first},`,
    "",
    `Welcome to ${siteConfig.name}! Enter this verification code to finish`,
    "creating your account:",
    "",
    input.code,
    "",
    "The code expires in 15 minutes.",
    "",
    `If you did not sign up, you can ignore this email.`,
    "",
    `${siteConfig.name} · ${siteConfig.address} · ${siteConfig.phone}`,
  ].join("\n");

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="52" valign="top">
          <div style="width:48px;height:48px;border-radius:12px;background:${BRAND_LIGHT};text-align:center;line-height:48px;font-size:22px;color:${BRAND};">✉</div>
        </td>
        <td valign="top" style="padding-left:4px;">
          <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:${INK};line-height:1.25;">Verify your email</h2>
          <p style="margin:0;font-size:15px;color:${MUTED};">Hi ${esc(first)}, one more step to finish your account.</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;background:${CREAM};border-radius:12px;border:1px solid ${BORDER};">
      <tr>
        <td style="padding:24px 20px;text-align:center;">
          <p style="margin:0 0 8px;font-size:13px;color:${MUTED};letter-spacing:0.04em;text-transform:uppercase;">Your verification code</p>
          <p style="margin:0;font-size:36px;font-weight:800;color:${BRAND};letter-spacing:0.35em;font-family:ui-monospace,Menlo,Consolas,monospace;">${esc(input.code)}</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:14px 18px;background:${BRAND_LIGHT};border-radius:10px;border-left:4px solid ${BRAND};">
          <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.5;">
            <strong style="color:${INK};">⏱ 15 minutes</strong> · Enter this code on the sign-up page to verify your email.
          </p>
        </td>
      </tr>
    </table>`;

  await deliver({
    to: input.to,
    subject: `Verify your ${siteConfig.name} email`,
    text,
    html: emailLayout("Verify your email", bodyHtml),
  });
}

/** Alerts the store inbox when a customer places a pickup order online. */
export async function sendOrderNotificationEmail(order: Order): Promise<void> {
  const lines = order.items.map((item) => {
    const unit =
      item.priceCents === null ? "At store" : formatCents(item.priceCents);
    return `  · ${item.qty}× ${item.name} — ${unit}`;
  });

  const totalLabel =
    order.totalCents === null
      ? "Confirmed at the counter"
      : formatCents(order.totalCents);

  const trackUrl = `${siteUrl()}/order/${order.trackingToken}`;
  const teamUrl = `${siteUrl()}/team`;
  const when = formatWhen(order.createdAt);

  const text = [
    `New pickup order on ${siteConfig.name}`,
    "",
    `Order:   ${order.orderNumber}`,
    `Status:  ${order.status}`,
    `Time:    ${when}`,
    "",
    "Customer",
    `  Name:  ${order.customer.name}`,
    `  Phone: ${order.customer.phone}`,
    order.customer.email ? `  Email: ${order.customer.email}` : null,
    "",
    "Items",
    ...lines,
    "",
    `Total: ${totalLabel} (pay at store)`,
    order.notes ? `Notes: ${order.notes}` : null,
    "",
    `Track: ${trackUrl}`,
    `Team board: ${teamUrl}`,
    "",
    `${siteConfig.name} · ${siteConfig.address} · ${siteConfig.phone}`,
  ]
    .filter(Boolean)
    .join("\n");

  const notesBlock = order.notes
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
        <tr>
          <td style="padding:16px 18px;background:${BRAND_LIGHT};border-radius:12px;border:1px solid rgba(144,0,0,0.12);">
            ${sectionLabel("Customer notes")}
            <p style="margin:0;font-size:15px;color:${INK};line-height:1.55;font-style:italic;">"${esc(order.notes)}"</p>
          </td>
        </tr>
      </table>`
    : "";

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td>
          <span style="display:inline-block;padding:5px 12px;background:${BRAND};color:#fff;font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;border-radius:6px;">New pickup order</span>
        </td>
        <td align="right" style="font-size:12px;color:${MUTED};">${esc(when)}</td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td>
          <h2 style="margin:12px 0 10px;font-size:34px;font-weight:800;color:${INK};letter-spacing:-0.02em;line-height:1;">${esc(order.orderNumber)}</h2>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td>${statusBadge(order.status)}</td>
            <td style="padding-left:10px;"><span style="font-size:12px;color:${MUTED};font-weight:600;">Pay at store</span></td>
          </tr></table>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:18px 20px;background:${CREAM};border-bottom:1px solid ${BORDER};">
          ${sectionLabel("Customer")}
        </td>
      </tr>
      <tr>
        <td style="padding:20px;">
          <p style="margin:0 0 12px;font-size:20px;font-weight:800;color:${INK};">${esc(order.customer.name)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:16px;">
                <a href="tel:${esc(order.customer.phone.replace(/\D/g, ""))}" style="font-size:15px;font-weight:600;color:${BRAND};text-decoration:none;">📞 ${esc(order.customer.phone)}</a>
              </td>
              ${order.customer.email ? `<td><a href="mailto:${esc(order.customer.email)}" style="font-size:14px;font-weight:600;color:${BRAND};text-decoration:none;">✉️ ${esc(order.customer.email)}</a></td>` : ""}
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${sectionLabel("Order items")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <thead>
        <tr style="background:${CREAM};">
          <th style="padding:12px 16px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:left;border-bottom:1px solid ${BORDER};">Item</th>
          <th style="padding:12px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:center;border-bottom:1px solid ${BORDER};">Qty</th>
          <th style="padding:12px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:right;border-bottom:1px solid ${BORDER};">Unit</th>
          <th style="padding:12px 16px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:right;border-bottom:1px solid ${BORDER};">Total</th>
        </tr>
      </thead>
      <tbody>${orderItemRows(order)}</tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;border-radius:12px;overflow:hidden;background:linear-gradient(135deg,${BRAND_DARK} 0%,${BRAND} 100%);">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);">Order total</td>
              <td align="right" style="font-size:26px;font-weight:800;color:#fff;">${esc(totalLabel)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top:6px;font-size:12px;color:rgba(255,255,255,0.7);">Payment collected in-store at pickup</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${notesBlock}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <td align="center" style="padding-bottom:12px;">
          ${primaryButton(teamUrl, "Open team board")}
        </td>
      </tr>
      <tr>
        <td align="center">
          ${ghostButton(trackUrl, "View tracking page")}
        </td>
      </tr>
    </table>`;

  await deliver({
    to: orderNotificationEmail(),
    subject: `New order ${order.orderNumber} — ${order.customer.name}`,
    text,
    html: emailLayout(`New order ${order.orderNumber}`, bodyHtml),
  });
}

function orderItemRows(order: Order): string {
  return order.items
    .map((item, i) => {
      const unit =
        item.priceCents === null ? "At store" : formatCents(item.priceCents);
      const lineTotal =
        item.priceCents === null ? "—" : formatCents(item.priceCents * item.qty);
      const bg = i % 2 === 0 ? WHITE : CREAM;
      return `<tr style="background:${bg};">
        <td style="padding:14px 16px;font-size:15px;color:${INK};border-bottom:1px solid ${BORDER};">
          <span style="font-weight:700;">${esc(item.name)}</span>
        </td>
        <td style="padding:14px 12px;font-size:13px;color:${MUTED};text-align:center;border-bottom:1px solid ${BORDER};white-space:nowrap;">
          <span style="display:inline-block;min-width:28px;padding:4px 10px;background:${WHITE};border:1px solid ${BORDER};border-radius:6px;font-weight:700;color:${INK};">${item.qty}</span>
        </td>
        <td style="padding:14px 12px;font-size:13px;color:${MUTED};text-align:right;border-bottom:1px solid ${BORDER};white-space:nowrap;">${esc(unit)}</td>
        <td style="padding:14px 16px;font-size:15px;font-weight:700;color:${INK};text-align:right;border-bottom:1px solid ${BORDER};white-space:nowrap;">${esc(lineTotal)}</td>
      </tr>`;
    })
    .join("");
}

/** Confirmation email for the customer who placed the order. */
export async function sendOrderConfirmationEmail(
  order: Order,
  to: string,
): Promise<void> {
  const first = order.customer.name.trim().split(/\s+/)[0] || "there";
  const trackUrl = `${siteUrl()}/order/${order.trackingToken}`;
  const when = formatWhen(order.createdAt);

  const totalLabel =
    order.totalCents === null
      ? "Confirmed at the counter"
      : formatCents(order.totalCents);

  const lines = order.items.map((item) => {
    const unit =
      item.priceCents === null ? "At store" : formatCents(item.priceCents);
    return `  · ${item.qty}× ${item.name} — ${unit}`;
  });

  const text = [
    `Hi ${first},`,
    "",
    `Thanks for ordering from ${siteConfig.name}!`,
    "",
    `Order: ${order.orderNumber}`,
    `Placed: ${when}`,
    "",
    "Items",
    ...lines,
    "",
    `Total: ${totalLabel} (pay when you pick up)`,
    order.notes ? `Your notes: ${order.notes}` : null,
    "",
    `Track your order: ${trackUrl}`,
    "",
    `Pick up at ${siteConfig.address}. We'll call ${order.customer.phone} when it's ready.`,
    "",
    `${siteConfig.name} · ${siteConfig.phone}`,
  ]
    .filter(Boolean)
    .join("\n");

  const notesBlock = order.notes
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;">
        <tr>
          <td style="padding:16px 18px;background:${CREAM};border-radius:12px;border:1px solid ${BORDER};">
            ${sectionLabel("Your notes")}
            <p style="margin:0;font-size:15px;color:${INK};line-height:1.55;">${esc(order.notes)}</p>
          </td>
        </tr>
      </table>`
    : "";

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td width="52" valign="top">
          <div style="width:48px;height:48px;border-radius:12px;background:${BRAND_LIGHT};text-align:center;line-height:48px;font-size:22px;">✓</div>
        </td>
        <td valign="top" style="padding-left:4px;">
          <h2 style="margin:0 0 6px;font-size:22px;font-weight:800;color:${INK};line-height:1.25;">Thanks, ${esc(first)}!</h2>
          <p style="margin:0;font-size:15px;color:${MUTED};">Your pickup order is in. We're making it fresh now.</p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td>
          <h3 style="margin:0 0 8px;font-size:32px;font-weight:800;color:${INK};letter-spacing:-0.02em;">${esc(order.orderNumber)}</h3>
          <p style="margin:0;font-size:13px;color:${MUTED};">Ordered ${esc(when)} · ${statusBadge(order.status)}</p>
        </td>
      </tr>
    </table>

    ${sectionLabel("Your order")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <thead>
        <tr style="background:${CREAM};">
          <th style="padding:12px 16px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:left;border-bottom:1px solid ${BORDER};">Item</th>
          <th style="padding:12px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:center;border-bottom:1px solid ${BORDER};">Qty</th>
          <th style="padding:12px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:right;border-bottom:1px solid ${BORDER};">Unit</th>
          <th style="padding:12px 16px;font-size:10px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};text-align:right;border-bottom:1px solid ${BORDER};">Total</th>
        </tr>
      </thead>
      <tbody>${orderItemRows(order)}</tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-radius:12px;overflow:hidden;background:linear-gradient(135deg,${BRAND_DARK} 0%,${BRAND} 100%);">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.85);">Total at pickup</td>
              <td align="right" style="font-size:26px;font-weight:800;color:#fff;">${esc(totalLabel)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top:6px;font-size:12px;color:rgba(255,255,255,0.7);">Pay at the store when you collect your order</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${notesBlock}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:${CREAM};border-radius:12px;border:1px solid ${BORDER};">
      <tr>
        <td style="padding:18px 20px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">Pickup</p>
          <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:${INK};">${esc(siteConfig.address)}</p>
          <p style="margin:0;font-size:14px;color:${MUTED};line-height:1.6;">
            We'll call <strong style="color:${INK};">${esc(order.customer.phone)}</strong> when your order is ready.
          </p>
        </td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          ${primaryButton(trackUrl, "Track your order")}
        </td>
      </tr>
    </table>`;

  await deliver({
    to,
    subject: `Your ${siteConfig.name} order ${order.orderNumber} is confirmed`,
    text,
    html: emailLayout(`Order ${order.orderNumber} confirmed`, bodyHtml),
  });
}
