import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/site/LegalDoc";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy | Crimson Deli",
  description:
    "How Crimson Deli collects, uses, shares and protects the information you give us when you order fresh food for pickup, create an account, leave a review or contact the store.",
  keywords: [
    "Crimson Deli privacy policy",
    "deli customer data",
    "pickup order privacy",
    "Philadelphia deli privacy",
  ],
  alternates: { canonical: "/privacy" },
};

const EFFECTIVE = "2026-09-03";

/**
 * Written against what the site actually does, not a template. Every claim is
 * checkable in the code: the signed session cookie in lib/auth/session.ts, the
 * scrypt hashing in lib/auth/password.ts, the IP rate-limit buckets in
 * lib/security/rate-limit.ts, the token TTLs in lib/auth/reset-tokens.ts and
 * lib/auth/email-verify.ts, and Firebase / Resend / Vercel as the only
 * processors that ever see this data. If any of those change, this page
 * changes with them.
 */
const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: [
      `${siteConfig.name} is a neighborhood deli and convenience store at ${siteConfig.address}. This policy covers this website and the fresh food pickup orders placed through it.`,
      `For anything in this policy, email ${siteConfig.email} or call ${siteConfig.phone}.`,
    ],
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: [
      "Information you give us:",
      {
        list: [
          "Account details: your name, email address and, if you give one, a phone number. Passwords are stored only as a salted scrypt hash, so we never hold the password itself and cannot read it.",
          "Google or phone sign-in: if you use one of those, we receive an account identifier from Firebase along with the name, email address or phone number attached to it.",
          "Orders: the items and quantities you order, any note you add, and the name, phone number and email address you give at checkout.",
          "Contact form messages: your name, email address, optional phone number, subject and whatever you write to us.",
          "Reviews: the display name, star rating and review text you submit for an item.",
        ],
      },
      "Information created or collected automatically:",
      {
        list: [
          "The order number and private tracking link we generate for each order, and the record of its status as it moves from received to collected.",
          "Your IP address, used to rate-limit sign-in attempts, contact messages and reviews so the forms are not flooded by automated abuse. Those counters are short-lived and expire on their own.",
          "Standard server and hosting logs, for security and troubleshooting.",
        ],
      },
      "We do not take card or bank details on this website. Nothing is charged here. Fresh food orders are paid for at the counter when you collect them, so no card number, expiry date or security code ever reaches this site.",
      "There is no advertising network, analytics profiling or cross-site tracking on this website.",
    ],
  },
  {
    id: "why-we-use-it",
    heading: "Why we use it",
    body: [
      "We use what we collect to run the store and nothing else:",
      {
        list: [
          "To prepare your order and have it ready when you arrive.",
          "To contact you about that order if something is unclear or unavailable.",
          "To send the order confirmation and the tracking link.",
          "To answer messages you send through the contact form.",
          "To show reviews on the item they were written about.",
          "To keep your account secure and to sign you in.",
          "To prevent abuse of the sign-in, contact and review forms.",
          "To keep the business and tax records a store is expected to keep.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    heading: "Cookies and browser storage",
    body: [
      "This site uses two things, both strictly to make it work:",
      {
        list: [
          "A sign-in cookie. When you sign in we set a cookie holding your account id, name and role. It is cryptographically signed so it cannot be edited, marked HttpOnly so page scripts cannot read it, and it expires after 12 hours. Signing out removes it.",
          "Your cart. Items you add are kept in your own browser storage, on your device. They are not sent to us until you place the order, and clearing your browser data clears the cart.",
        ],
      },
      "We do not use advertising cookies, analytics trackers or third-party profiling of any kind. Nothing on this site follows you to other websites.",
    ],
  },
  {
    id: "who-we-share-with",
    heading: "Who else sees it",
    body: [
      "We do not sell, rent or trade your information. We use a small number of service providers to run the site, and they may only process data on our instructions:",
      {
        list: [
          "Google, through Firebase. Hosts the database holding accounts, orders, messages and reviews, and handles Google and phone sign-in.",
          "Resend. Sends the transactional email, meaning order confirmations, email verification codes and password reset links.",
          "Vercel. Hosts and serves this website.",
        ],
      },
      "DoorDash is separate. Our everyday essentials link out to DoorDash, and once you follow that link you are on their service under their privacy policy. We do not pass them anything about you from this site.",
      "Inside the store, staff and admin accounts can see orders and contact messages so they can do their jobs. Changes made to orders, products, staff accounts and settings are recorded in an internal audit log.",
      "We may also disclose information where the law requires it, or where it is needed to establish or defend a legal claim.",
    ],
  },
  {
    id: "how-long",
    heading: "How long we keep it",
    body: [
      {
        list: [
          "Account details: for as long as you have an account with us.",
          "Orders: kept as part of the store business records.",
          "Contact messages and reviews: until they are dealt with or removed.",
          "Password reset links: one hour, and they can only be used once.",
          "Email verification codes: 15 minutes.",
          "Rate-limiting counters: short-lived, from minutes up to an hour.",
        ],
      },
    ],
  },
  {
    id: "your-choices",
    heading: "Your choices",
    body: [
      "You can ask us to:",
      {
        list: [
          "Tell you what we hold about you.",
          "Correct anything that is wrong.",
          "Delete your account and the personal details attached to it.",
          "Take down a review you posted.",
        ],
      },
      `Email ${siteConfig.email} or call ${siteConfig.phone} and we will sort it out. We may need to confirm who you are first. We may keep basic records of completed orders even after an account is deleted, where we are required to.`,
      "You can change your own password at any time from your account page, and you can clear your cart at any time by emptying it or clearing your browser data.",
    ],
  },
  {
    id: "security",
    heading: "How we protect it",
    body: [
      {
        list: [
          "Passwords are salted and hashed with scrypt, and are never stored as readable text.",
          "Sign-in cookies are cryptographically signed, so they cannot be forged or edited.",
          "Changing a password immediately invalidates sign-in sessions on other devices.",
          "Password reset links and email verification codes are stored only as hashes, are single use, and expire.",
          "The site is served over HTTPS.",
          "Staff accounts only reach what their role needs, and sensitive actions are recorded in an audit log.",
        ],
      },
      "No system is perfect, and we will tell you promptly if something happens that affects your information.",
    ],
  },
  {
    id: "children",
    heading: "Children",
    body: [
      "This site is not directed at children under 13, and we do not knowingly collect their information. If you believe a child has given us personal details, contact us and we will remove them.",
    ],
  },
  {
    id: "changes",
    heading: "Changes to this policy",
    body: [
      "If we change how the site handles your information, we will update this page and move the effective date at the top. Continuing to use the site after a change means you accept the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Privacy Policy", path: "/privacy" }]} />
      <LegalDoc
        title="Privacy Policy"
        effective={EFFECTIVE}
        intro="This page explains what Crimson Deli collects when you use this website, why we collect it, who else is involved, and what you can ask us to do about it. It is written against what the site actually does rather than as a generic template."
        sections={SECTIONS}
      />
    </>
  );
}
