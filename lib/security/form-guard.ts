import { NextResponse } from "next/server";
import { verifyRecaptcha } from "./recaptcha";

/**
 * Spam checks shared by the public forms (contact, reviews, sign up, sign in,
 * forgot password). Layered so each one catches what the others miss:
 *
 *  - honeypot: a field people never see. Bots that fill every input fill it.
 *  - fill time: a person takes a few seconds to type a message; a script
 *    posts the moment the page loads.
 *  - reCAPTCHA v2: the checkbox, verified with Google on the server.
 *  - content: link-stuffed or HTML-laden text (see `spamReason`).
 *
 * The rate limits in each route still apply on top of all of this.
 */

/** Name of the hidden field. Must match `components/security/FormGuard.tsx`. */
export const HONEYPOT_FIELD = "website";

export type GuardedBody = {
  website?: unknown;
  elapsedMs?: unknown;
  recaptchaToken?: unknown;
};

type GuardOptions = {
  ip: string;
  /** Fastest a person could plausibly fill the form. 0 turns the check off. */
  minFillMs?: number;
};

const BLOCKED = "Your submission could not be accepted. Please try again.";

/** Returns a response to send back when the submission fails, else null. */
export async function guardForm(
  body: GuardedBody,
  { ip, minFillMs = 2500 }: GuardOptions,
): Promise<NextResponse | null> {
  const trap = body[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    console.warn("[form-guard] honeypot filled", { ip });
    return NextResponse.json({ error: BLOCKED }, { status: 400 });
  }

  if (minFillMs > 0) {
    const elapsed = Number(body.elapsedMs);
    if (!Number.isFinite(elapsed) || elapsed < minFillMs) {
      console.warn("[form-guard] submitted too fast", { ip, elapsed });
      return NextResponse.json(
        { error: "That was quick! Please take a moment and send it again." },
        { status: 400 },
      );
    }
  }

  const token = typeof body.recaptchaToken === "string" ? body.recaptchaToken : undefined;
  if (!(await verifyRecaptcha(token, ip))) {
    return NextResponse.json(
      { error: "Please tick the “I'm not a robot” box and try again.", captcha: true },
      { status: 400 },
    );
  }

  return null;
}

const URL_RE = /(https?:\/\/|www\.)\S+/i;
const URL_ALL_RE = /(https?:\/\/|www\.)\S+/gi;
const HTML_RE = /<\/?[a-z][^>]*>|\[url[=\]]/i;

/**
 * Content check for free text people leave for others to read. `name` should
 * never hold a link; `text` may hold one (someone pasting a menu link), but
 * not a pile of them.
 */
export function spamReason({ name, text }: { name?: string; text: string }): string | null {
  if (name && (URL_RE.test(name) || HTML_RE.test(name))) {
    return "Please use just your name in the name field.";
  }

  const links = text.match(URL_ALL_RE)?.length ?? 0;
  if (links > 2) return "Please leave out the links and try again.";
  if (HTML_RE.test(text)) return "Please send plain text without code or markup.";
  // One character repeated for a long run is keyboard mashing, not a message.
  if (/(.)\1{14,}/.test(text)) return "Please write a real message.";
  return null;
}
