import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/site/Breadcrumb";
import { getOrderByToken } from "@/lib/orders/store";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/types";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order status",
  description: "Track the status of your Crimson Deli pickup order.",
};

/** The pickup lifecycle. There is no delivery stage — fresh food is collected. */
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
        <section className="reservation-section fix section-padding position-relative">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="table-cart-inner p-xxl-4 p-3">
                  <h4 className="text-black mb-2">We can&rsquo;t find that order</h4>
                  <p className="fs-16 text-clr mb-4">
                    This tracking link doesn&rsquo;t match an order. Check the link from
                    your confirmation, or call the store on{" "}
                    <a href={siteConfig.phoneHref} className="theme-clr fw-semibold">
                      {siteConfig.phone}
                    </a>
                    .
                  </p>
                  <Link href="/food" className="theme-btn rounded-1 text-uppercase fs-13">
                    Fresh food menu
                  </Link>
                </div>
              </div>
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

      <section className="reservation-section fix section-padding position-relative">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-8">
              <div className="table-cart-inner p-xxl-4 p-3">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <h4 className="text-black mb-1">Order {order.orderNumber}</h4>
                    <p className="fs-14 text-clr mb-0">
                      Placed {formatWhen(order.createdAt)}
                    </p>
                  </div>
                  <span className="fs-14 fw-semibold theme-clr text-uppercase">
                    {cancelled ? "Cancelled" : STAGES[currentIndex]?.label}
                  </span>
                </div>

                {cancelled ? (
                  <div className="portal-note mb-4" style={{ marginTop: 0 }}>
                    This order was cancelled. Call the store on{" "}
                    <a href={siteConfig.phoneHref} className="fw-semibold">
                      {siteConfig.phone}
                    </a>{" "}
                    if that looks wrong.
                  </div>
                ) : (
                  <ol className="d-grid gap-3 ps-3 mb-4">
                    {STAGES.map((stage, i) => {
                      const done = i <= currentIndex;
                      return (
                        <li key={stage.key} style={{ opacity: done ? 1 : 0.45 }}>
                          <strong className="text-black">
                            {stage.label}
                            {done && i === currentIndex ? " · now" : ""}
                          </strong>
                          <span className="d-block fs-14 text-clr">{stage.blurb}</span>
                        </li>
                      );
                    })}
                  </ol>
                )}

                <h5 className="text-black mb-2">Your items</h5>
                <ul className="d-grid gap-1 ps-3 mb-3">
                  {order.items.map((item) => (
                    <li key={item.productSlug} className="fs-14">
                      {item.qty} × {item.name}
                    </li>
                  ))}
                </ul>

                {order.notes && (
                  <p className="fs-14 text-clr mb-3">
                    <strong className="text-black">Notes:</strong> {order.notes}
                  </p>
                )}

                <p className="fs-14 text-clr mb-4">
                  {order.totalCents === null
                    ? "Total is confirmed by the store when you collect."
                    : `Total $${(order.totalCents / 100).toFixed(2)}`}{" "}
                  · Pay at store · Collect from {siteConfig.address}
                </p>

                <div className="d-flex gap-3 flex-wrap">
                  <Link href="/food" className="theme-btn rounded-1 text-uppercase fs-13">
                    Order again
                  </Link>
                  <Link
                    href="/contact"
                    className="theme-btn rounded-1 theme-opacity-10 text-uppercase fs-13"
                  >
                    <span className="theme-clr">Contact the store</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
