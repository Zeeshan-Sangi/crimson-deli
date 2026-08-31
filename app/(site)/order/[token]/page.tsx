import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/site/Breadcrumb";
import { getOrderByToken } from "@/lib/orders/store";
import { type OrderStatus } from "@/lib/orders/types";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order status",
  description: "Track the status of your Crimson Deli pickup order.",
};

const STAGES: { key: OrderStatus; label: string; blurb: string }[] = [
  { key: "received", label: "Order received", blurb: "We have your order at the counter." },
  { key: "preparing", label: "Preparing", blurb: "Your food is being made fresh." },
  { key: "packed", label: "Packed", blurb: "Bagged and waiting for you." },
  { key: "picked_up", label: "Picked up", blurb: "Collected. Enjoy!" },
];

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  if (!order) {
    return (
      <>
        <Breadcrumb title="Order status" trail={[{ label: "Order status" }]} />
        <section className="cd-section cd-section--cream">
          <div className="cd-page-wrap cd-order">
            <div className="cd-panel cd-order__card">
              <h1>We can&apos;t find that order</h1>
              <p>
                This tracking link doesn&apos;t match an order. Check the link from your
                confirmation, or call the store on{" "}
                <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
              </p>
              <Link href="/food" className="cd-btn-solid">
                Fresh food menu
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  const cancelled = order.status === "cancelled";
  const currentIndex = STAGES.findIndex((s) => s.key === order.status);

  return (
    <>
      <Breadcrumb title="Order status" trail={[{ label: "Order status" }]} />

      <section className="cd-section cd-section--cream">
        <div className="cd-page-wrap cd-order">
          <div className="cd-panel cd-order__card">
            <div className="cd-order__head">
              <div>
                <h1>Order {order.orderNumber}</h1>
                <p className="cd-order__meta">Placed {formatWhen(order.createdAt)}</p>
              </div>
              <span className="cd-order__badge">
                {cancelled ? "Cancelled" : STAGES[currentIndex]?.label}
              </span>
            </div>

            {cancelled ? (
              <p className="cd-order__note">
                This order was cancelled. Call the store on{" "}
                <a href={siteConfig.phoneHref}>{siteConfig.phone}</a> if that looks wrong.
              </p>
            ) : (
              <ol className="cd-order__steps">
                {STAGES.map((stage, i) => {
                  const done = i <= currentIndex;
                  const current = done && i === currentIndex;
                  return (
                    <li
                      key={stage.key}
                      className="cd-order__step"
                      data-done={done ? "true" : "false"}
                      data-current={current ? "true" : "false"}
                    >
                      <strong>
                        {stage.label}
                        {current ? " · now" : ""}
                      </strong>
                      <span>{stage.blurb}</span>
                    </li>
                  );
                })}
              </ol>
            )}

            <h2 className="cd-order__subhead">Your items</h2>
            <ul className="cd-order__items">
              {order.items.map((item) => (
                <li key={`${item.productSlug}-${item.size ?? "default"}`}>
                  {item.qty} × {item.name}
                </li>
              ))}
            </ul>

            {order.notes && (
              <p className="cd-order__note">
                <strong>Notes:</strong> {order.notes}
              </p>
            )}

            <p className="cd-order__meta">
              {order.totalCents === null
                ? "Total is confirmed by the store when you collect."
                : `Total $${(order.totalCents / 100).toFixed(2)}`}{" "}
              · Pay at store · Collect from {siteConfig.address}
            </p>

            <div className="cd-not-found__actions">
              <Link href="/food" className="cd-btn-solid">
                Order again
              </Link>
              <Link href="/contact" className="cd-btn-solid cd-btn-solid--ghost">
                Contact the store
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
