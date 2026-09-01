import type { Order } from "@/lib/orders/types";
import { siteConfig } from "@/lib/site-config";

type Email = {
  to: string | string[];
  subject: string;
  text: string;
};

const DEFAULT_FROM = "Crimson Deli <no-reply@crimsondeli.com>";

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

/** Where new-order alerts go. Defaults to the store inbox. */
export function orderNotificationEmail(): string {
  const configured = process.env.ORDER_NOTIFY_EMAIL?.trim();
  return configured || siteConfig.email;
}

function resendFrom(): string {
  return process.env.RESEND_FROM?.trim() || DEFAULT_FROM;
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

/** Alerts the store inbox when a customer places a pickup order online. */
export async function sendOrderNotificationEmail(order: Order): Promise<void> {
  const lines = order.items.map((item) => {
    const unit =
      item.priceCents === null ? "price at store" : formatCents(item.priceCents);
    return `  · ${item.qty}× ${item.name} — ${unit}`;
  });

  const total =
    order.totalCents === null
      ? "Total: confirmed at the counter"
      : `Total: ${formatCents(order.totalCents)} (pay at store)`;

  const trackUrl = `${siteUrl()}/order/${order.trackingToken}`;
  const teamUrl = `${siteUrl()}/team`;

  await deliver({
    to: orderNotificationEmail(),
    subject: `New order ${order.orderNumber} — ${order.customer.name}`,
    text: [
      `New pickup order on ${siteConfig.name}`,
      "",
      `Order:   ${order.orderNumber}`,
      `Status:  ${order.status}`,
      "",
      "Customer",
      `  Name:  ${order.customer.name}`,
      `  Phone: ${order.customer.phone}`,
      order.customer.email ? `  Email: ${order.customer.email}` : null,
      "",
      "Items",
      ...lines,
      "",
      total,
      order.notes ? `Notes: ${order.notes}` : null,
      "",
      `Track: ${trackUrl}`,
      `Team board: ${teamUrl}`,
      "",
      `${siteConfig.name} · ${siteConfig.address} · ${siteConfig.phone}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
