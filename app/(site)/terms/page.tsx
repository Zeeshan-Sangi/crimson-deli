import type { Metadata } from "next";
import LegalDoc, { type LegalSection } from "@/components/site/LegalDoc";
import { BreadcrumbJsonLd } from "@/components/site/JsonLd";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms & Conditions | Crimson Deli",
  description:
    "The terms you agree to when you order fresh food for pickup from Crimson Deli on Ogontz Avenue, create an account, or leave a review on this site.",
  keywords: [
    "Crimson Deli terms and conditions",
    "deli pickup order terms",
    "Philadelphia deli allergen policy",
    "pay at store terms",
  ],
  alternates: { canonical: "/terms" },
};

const EFFECTIVE = "2026-09-03";

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    heading: "About these terms",
    body: [
      `These terms apply to this website and to the fresh food pickup orders placed through it, operated by ${siteConfig.name} of ${siteConfig.address}.`,
      `By using the site or placing an order you agree to them. If you do not agree, please order by phone on ${siteConfig.phone} instead.`,
    ],
  },
  {
    id: "pickup-only",
    heading: "Fresh food is pickup only",
    body: [
      `We do not deliver fresh food. Everything on the fresh food menu is made at our counter and collected in person at ${siteConfig.address}.`,
      "Our everyday essentials are a separate lane: buy them on the shelves in store, or order them for delivery through DoorDash.",
    ],
  },
  {
    id: "orders",
    heading: "Placing an order",
    body: [
      {
        list: [
          "You need an account to order, so that every order has someone we can contact.",
          "Give a name and a working phone number. We use them to reach you if anything about the order is unclear.",
          "An order placed on the site is a request, not a completed contract. It is accepted when we start preparing it.",
          "Orders can only be placed while the store is open and online ordering is switched on. Outside those times the checkout will tell you when we reopen.",
          "The preparation time shown is an estimate for planning, not a guaranteed time. Busy periods run longer.",
        ],
      },
      "After ordering you get an order number and a private tracking link. Anyone holding that link can see the status of that order, so please treat it as private.",
    ],
  },
  {
    id: "prices-payment",
    heading: "Prices and payment",
    body: [
      {
        list: [
          "Prices are in US dollars and are the ones shown at the time you order.",
          "Totals are always recalculated by us from the current menu. If a price on your screen is out of date, the current store price is the one that applies.",
          "Some items are marked as priced at store. Those are confirmed at the counter when you collect.",
          "Sales tax is applied at the rate set by the store, where it applies.",
        ],
      },
      `Payment is taken in store, when you collect. This site does not accept card payments and never asks for card details. Anyone asking you to pay online for a ${siteConfig.name} order is not us, so please call the store.`,
    ],
  },
  {
    id: "changes-cancellation",
    heading: "Changes, cancellation and refunds",
    body: [
      `To change or cancel an order, call the store on ${siteConfig.phone} as soon as you can. If we have not made it yet we can usually stop it.`,
      "We may cancel an order if:",
      {
        list: [
          "an item turns out to be sold out;",
          "we cannot reach you about a problem with it;",
          "it is not collected; or",
          "we believe the order was not placed genuinely.",
        ],
      },
      "Because payment happens at the counter, an order cancelled before collection leaves nothing to refund. If something is wrong with food you have already paid for, tell us the same day and we will put it right with a replacement or a refund.",
    ],
  },
  {
    id: "allergens",
    heading: "Allergens and food safety",
    body: [
      "Please speak to staff before ordering if you have a food allergy or intolerance.",
      "Our food is prepared in a single small kitchen using shared equipment and surfaces. We handle milk, eggs, wheat and gluten, soy, peanuts, tree nuts, fish, shellfish and sesame. We cannot guarantee that any item is free from any allergen, and we cannot guarantee an absence of cross-contact.",
      `The notes box at checkout is passed to the counter, but it is a request and not a safety guarantee. If a reaction would be serious, talk to us directly on ${siteConfig.phone} before you order.`,
      "Fresh food is made to be eaten the same day. Please refrigerate anything you are not eating straight away.",
    ],
  },
  {
    id: "accounts",
    heading: "Your account",
    body: [
      {
        list: [
          "Give accurate details and keep them up to date.",
          "Keep your password to yourself. You are responsible for what happens on your account.",
          "Tell us promptly if you think someone else has access to it.",
          "We may suspend or close an account used for fraud, abuse or anything unlawful.",
          "One person, one account. Do not sign up on someone else's behalf without their say-so.",
        ],
      },
    ],
  },
  {
    id: "reviews",
    heading: "Reviews and anything you post",
    body: [
      "When you leave a review, you confirm that:",
      {
        list: [
          "it is your own honest opinion of the item;",
          "it is not abusive, misleading, or someone else's work; and",
          "it contains nothing private about another person.",
        ],
      },
      "You keep ownership of what you write, and you allow us to display it on the site alongside the item. We may remove any review that breaks these terms, or that is not a genuine review of the item.",
    ],
  },
  {
    id: "doordash",
    heading: "DoorDash and other links",
    body: [
      "Everyday essentials ordered for delivery go through DoorDash, which is an independent service. Their prices, delivery charges, availability, substitution rules and refunds are theirs rather than ours, and are governed by their terms. The same applies to any other site we link to.",
    ],
  },
  {
    id: "site-content",
    heading: "Site content",
    body: [
      `The name, logo, photography, menu descriptions and design of this site belong to ${siteConfig.name} or are used with permission.`,
      "You are welcome to browse, share links and print pages for your own use. Please do not copy the content for commercial use, or scrape the site, without asking us first.",
    ],
  },
  {
    id: "availability",
    heading: "Availability and accuracy",
    body: [
      "We work to keep the menu, prices and opening hours correct, but the site is provided as it is. Items sell out, hours change for holidays, and the site may be unavailable for maintenance.",
      "Where anything on the site differs from what the store tells you directly, the store is right.",
    ],
  },
  {
    id: "liability",
    heading: "Our responsibility to you",
    body: [
      "Nothing in these terms limits any liability that cannot be limited by law, including liability for death or personal injury caused by negligence, or for fraud. Your statutory rights as a consumer are unaffected.",
      "Beyond that, our responsibility for any order is limited to the value of that order, and we are not responsible for indirect or consequential losses such as lost time or lost earnings.",
    ],
  },
  {
    id: "law",
    heading: "Governing law",
    body: [
      "These terms are governed by the laws of the Commonwealth of Pennsylvania, United States, and disputes fall to the courts of Philadelphia County.",
      "If any part of these terms turns out to be unenforceable, the rest still stands.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Terms & Conditions", path: "/terms" }]} />
      <LegalDoc
        title="Terms & Conditions"
        effective={EFFECTIVE}
        intro="These are the terms for ordering fresh food from Crimson Deli for pickup, using an account on this site, and posting reviews. The short version: order here, pay and collect in store, and talk to us before ordering if you have a food allergy."
        sections={SECTIONS}
      />
    </>
  );
}
