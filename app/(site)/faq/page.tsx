import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/site/Breadcrumb";
import FaqWorkspace, { type FaqCategory } from "@/components/site/FaqWorkspace";
import { BreadcrumbJsonLd, JsonLd } from "@/components/site/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { formatHoursLine } from "@/lib/settings/format";
import { getSettings } from "@/lib/settings/store";
import { formatTaxRateLabel } from "@/lib/settings/tax";

export const metadata: Metadata = {
  title: "FAQ | Pickup Orders, Allergens & Delivery | Crimson Deli",
  description:
    "Answers on ordering fresh food for pickup from Crimson Deli on Ogontz Avenue: collection times, paying at the counter, allergens, DoorDash delivery and account help.",
  keywords: [
    "Crimson Deli FAQ",
    "deli pickup Philadelphia",
    "hoagies Ogontz Avenue",
    "fresh food pickup 19150",
    "deli allergen information",
    "order deli online Philadelphia",
    "convenience store delivery DoorDash Philadelphia",
    "Philadelphia deli opening hours",
    "pay at store pickup order",
  ],
  alternates: { canonical: "/faq" },
};

// Hours, prep time and tax come from store settings rather than being typed in
// here, so an admin editing them in the portal updates this page too.
export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const { store, checkout } = await getSettings();
  const hoursLine = formatHoursLine(store.hours);

  const taxAnswer = checkout.taxIncludedInPrice
    ? "The prices you see already include sales tax, so the number on screen is the number at the counter."
    : checkout.taxRate > 0
      ? `Sales tax of ${formatTaxRateLabel(checkout.taxRate)} is added at checkout where it applies, and it is shown as its own line before you confirm the order.`
      : "No sales tax is added on the site, so your total at the counter is the total you see here.";

  const categories: FaqCategory[] = [
    {
      id: "ordering",
      title: "Ordering & Pickup",
      blurb: "How to place a fresh food order, and how collection works.",
      items: [
        {
          q: "Do you deliver fresh food?",
          a: `No. Everything on the fresh food menu is made at our counter and collected in person at ${siteConfig.address}. If you want delivery, our everyday essentials are available through DoorDash instead.`,
        },
        {
          q: "How long until my order is ready?",
          a: `Around ${store.prepTimeMinutes} minutes at the moment. Treat that as an estimate for planning rather than a promise, because busy lunchtimes run longer. Your tracking link moves from received, to preparing, to packed, so you can see exactly where it is before you set off.`,
        },
        {
          q: "Do I need an account to order?",
          a: "Yes. Every order needs someone we can call if something is unclear, so ordering requires a signed-in account. Signing up takes under a minute, and you can also use Google or your phone number instead of a password.",
        },
        {
          q: "How do I track my order?",
          a: "Your confirmation includes a private tracking link you can open any time to see the current status. Orders placed while signed in are also listed on your account page. Keep the link to yourself, because anyone who has it can see that order.",
        },
        {
          q: "Can I change or cancel an order?",
          a: `Call the store on ${siteConfig.phone} as soon as you can. If we have not started making it, we can usually change or stop it. Since you pay at the counter, a cancelled order leaves nothing to refund.`,
        },
        {
          q: "Why can I not place an order right now?",
          a: "Online ordering runs while the store is open. Outside those hours, or if we have paused online orders during a rush, the checkout will say so and tell you when we reopen. You can still call the store to ask.",
        },
        {
          q: "Can I order ahead for a specific time?",
          a: `Orders go into the queue as they arrive rather than being scheduled for a later slot. For a big order or a set collection time, call us on ${siteConfig.phone} and we will arrange it directly.`,
        },
      ],
    },
    {
      id: "payment",
      title: "Payment & Prices",
      blurb: "What you pay, when you pay it, and how prices are worked out.",
      items: [
        {
          q: "How do I pay for a pickup order?",
          a: `At the counter when you collect. This site does not accept card payments and never asks for card details. If anyone asks you to pay online for a ${siteConfig.name} order, it is not us, so please call the store.`,
        },
        {
          q: "Is sales tax included in the price?",
          a: taxAnswer,
        },
        {
          q: "What does priced at store mean?",
          a: "A few items vary by weight or by what goes in them, so we confirm the price at the counter rather than guessing on the site. Everything else shows its real price, and your total is always recalculated by us from the current menu before the order is saved.",
        },
        {
          q: "The price changed between adding to my cart and checking out.",
          a: "Your cart is stored in your own browser, so a line added days ago keeps the price it had then. We refresh it against the live menu when you open the cart, and the current store price is always the one that applies.",
        },
        {
          q: "Do you take tips on the site?",
          a: "Tipping is handled in store rather than online, since payment happens at the counter.",
        },
      ],
    },
    {
      id: "menu",
      title: "Menu & Allergens",
      blurb: "What we make, what is in it, and how to ask for changes.",
      items: [
        {
          q: "I have a food allergy. What should I do?",
          a: `Please talk to us before ordering, on ${siteConfig.phone}. Our food is made in one small kitchen on shared equipment, and we handle milk, eggs, wheat, soy, peanuts, tree nuts, fish, shellfish and sesame. We cannot guarantee that any item is free of an allergen or free from cross-contact. The notes box at checkout reaches the counter, but treat it as a request rather than a safety guarantee.`,
        },
        {
          q: "An item I want says sold out.",
          a: "That means we have run out for today, and it usually returns the next morning. Items taken off the menu entirely stop appearing altogether. Call the store if you want to check on something specific.",
        },
        {
          q: "Can I customise an item?",
          a: "Add what you need to the notes box at checkout and the counter will see it. For anything more involved, such as a large order or a change we might not be able to make, call ahead so we can tell you straight away.",
        },
        {
          q: "Is the food made fresh, or prepared in advance?",
          a: "Hoagies, deli sandwiches, fruit bowls and smoothies are made when you order them, at our Ogontz Avenue counter, rather than shipped in ready-made. That is also why fresh food is pickup only.",
        },
        {
          q: "How long does fresh food keep?",
          a: "It is made to be eaten the same day. Please refrigerate anything you are not eating straight away.",
        },
      ],
    },
    {
      id: "essentials",
      title: "Essentials & DoorDash",
      blurb: "Snacks, drinks and household items, in store or delivered.",
      items: [
        {
          q: "How do I get everyday essentials delivered?",
          a: "Through DoorDash. Browse what we stock on the everyday essentials pages, then order on DoorDash from the link on the site. You can also just come in and pick them off the shelf.",
        },
        {
          q: "Can I put essentials in the same cart as fresh food?",
          a: "No, they are two separate lanes. Fresh food is ordered here for pickup, and essentials are bought in store or delivered by DoorDash, so the cart on this site only holds fresh food.",
        },
        {
          q: "Something was wrong with my DoorDash order.",
          a: `DoorDash handles their own deliveries, prices, substitutions and refunds, so raise it with them first. If it is about the goods themselves, call us on ${siteConfig.phone} and we will help.`,
        },
        {
          q: "Is the DoorDash price the same as in store?",
          a: "Not always. DoorDash sets its own pricing, service charges and delivery fees on top of the goods, so a delivered basket usually costs more than the same basket bought at the counter.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Sign-in",
      blurb: "Signing up, passwords, and managing your details.",
      items: [
        {
          q: "I did not get my verification code.",
          a: "Codes are six digits and expire after 15 minutes. Check your spam folder first, then use the resend option on the verification page. If nothing arrives, the address may have a typo, so call the store and we will sort it out.",
        },
        {
          q: "I forgot my password.",
          a: "Use the forgot password link on the sign-in page and we will email you a reset link. It lasts one hour and works once. Setting a new password immediately signs out any other device that was still signed in.",
        },
        {
          q: "Can I sign in with Google or my phone number?",
          a: "Yes. Both are on the sign-in page. If you already have an account with the same email address or phone number, signing in that way links to the account you already have rather than making a second one.",
        },
        {
          q: "How do I delete my account?",
          a: `Email ${siteConfig.email} or call the store and we will remove it. Our privacy policy explains what we keep afterwards and why.`,
        },
        {
          q: "How do I change my password?",
          a: "Sign in, open your account page, and use the change password form. You need your current password to set a new one, so a borrowed session cannot take over the account.",
        },
      ],
    },
    {
      id: "store",
      title: "Visiting the Store",
      blurb: "Where we are, when we are open, and how to reach a person.",
      items: [
        {
          q: "When are you open?",
          a: `${hoursLine}. Hours can change on public holidays, so call ahead if you are making a special trip.`,
        },
        {
          q: "Where are you?",
          a: `${siteConfig.address}. Full directions and a map link are on the contact page.`,
        },
        {
          q: "How do I reach a person?",
          a: `Call ${siteConfig.phone} during opening hours, which is quickest by far. You can also use the contact form on the site or email ${siteConfig.email}.`,
        },
        {
          q: "Do you cater for larger orders?",
          a: `Call ${siteConfig.phone} and talk to us directly. Large orders need a little notice so we can have them ready without holding up the counter.`,
        },
      ],
    },
  ];

  const allFaqs = categories.flatMap((category) => category.items);

  return (
    <>
      <JsonLd data={faqJsonLd("/faq", allFaqs)} />
      <BreadcrumbJsonLd items={[{ name: "FAQs", path: "/faq" }]} />

      <Breadcrumb title="FAQs" trail={[{ label: "FAQs" }]} />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap">
          <div className="cd-faq-intro">
            <span className="cd-section-head__eyebrow">Answers</span>
            <h2>Frequently asked questions</h2>
            <p>
              {allFaqs.length} straight answers on ordering, payment, allergens,
              DoorDash and account help. If yours is not here, call the store on{" "}
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> — someone at the
              counter can usually answer faster than email.
            </p>
          </div>

          <FaqWorkspace categories={categories} />

          <div className="cd-about-cta">
            <p>
              Still stuck? Call <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>{" "}
              or send us a message and we will come back to you.
            </p>
            <Link href="/contact" className="cd-btn-solid">
              Contact the store
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
