import type { Metadata } from "next";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import AccountShell from "@/components/portal/AccountShell";
import AccountWorkspace from "@/components/portal/AccountWorkspace";
import ReorderButton from "@/components/site/ReorderButton";
import { CartProvider } from "@/lib/cart/CartContext";
import { requirePageRole } from "@/lib/auth/current-user";
import { listOrders, ordersForUser } from "@/lib/orders/store";
import { listAvailableProducts } from "@/lib/products/store";
import { getBalance, listLedger } from "@/lib/rewards/store";
import { getSettings } from "@/lib/settings/store";
import { pointsToCents } from "@/lib/settings/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My account" };

function when(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
  });
}

export default async function AccountPage() {
  const user = await requirePageRole(["customer", "staff", "admin"]);

  // A customer must only ever see their own orders here — this page is open to
  // every signed-in role, and it used to show the five most recent orders
  // store-wide to whoever opened it.
  const isStaff = user.role === "staff" || user.role === "admin";
  const recent = isStaff
    ? (await listOrders()).slice(0, 5)
    : (await ordersForUser(user.id)).slice(0, 5);

  // Reordering rebuilds the lines from today's menu, so the customer's list
  // needs the menu alongside it. Staff see store-wide orders here, which are
  // other people's — there is nothing for them to reorder.
  const menu = isStaff ? [] : await listAvailableProducts();

  const { rewards } = await getSettings();
  const showRewards = !isStaff && rewards.enabled;
  const [points, ledger] = showRewards
    ? await Promise.all([getBalance(user.id), listLedger(user.id, 8)])
    : [0, []];
  const worthCents = showRewards ? pointsToCents(points, rewards) : 0;

  // Staff keep the operations sidebar; a customer has nothing to put in it, so
  // they get a plain page with a way back to the shop instead.
  const Shell = isStaff ? PortalShell : AccountShell;

  return (
    <Shell
      user={user}
      title="My account"
      subtitle={
        isStaff
          ? "Your sign-in details and password."
          : "Your details, password and order history."
      }
    >
      {showRewards && (
        <section className="crm-card" style={{ marginBottom: 20 }}>
          <div className="crm-card__head">
            <div>
              <h2>Reward points</h2>
              <p>
                {rewards.pointsPerDollar} points for every dollar you spend, once your
                order is picked up. {rewards.pointsPerDollarOff} points take a dollar off
                the next one.
              </p>
            </div>
            <Link href="/food" className="portal-btn">Order something</Link>
          </div>

          <p style={{ fontSize: 32, fontWeight: 800, margin: "4px 0 0" }}>
            {points.toLocaleString()}{" "}
            <span style={{ fontSize: 15, fontWeight: 600 }} className="portal-muted">
              points
              {worthCents > 0
                ? ` · $${(worthCents / 100).toFixed(2)} off your next order`
                : ` · ${Math.max(0, rewards.minRedeemPoints - points)} more to spend them`}
            </span>
          </p>

          {ledger.length > 0 && (
            <table className="portal-table" style={{ marginTop: 12 }}>
              <tbody>
                {ledger.map((entry) => (
                  <tr key={entry.id}>
                    <td>{when(entry.at)}</td>
                    <td>
                      {entry.reason === "earned" ? "Earned on" : "Spent on"}{" "}
                      <strong>{entry.orderNumber ?? "an order"}</strong>
                    </td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>
                      {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      <div className="crm-grid-2">
        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>Profile</h2>
              <p>Ask an admin to change your name, email or role.</p>
            </div>
          </div>
          <table className="portal-table">
            <tbody>
              <tr><td>Name</td><td style={{ textAlign: "right", fontWeight: 600 }}>{user.name}</td></tr>
              <tr><td>Email</td><td style={{ textAlign: "right" }}>{user.email}</td></tr>
              <tr>
                <td>Role</td>
                <td style={{ textAlign: "right" }}>
                  <span className="portal-badge portal-badge-packed" style={{ textTransform: "capitalize" }}>
                    {user.role}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="crm-card__head" style={{ marginTop: 20, marginBottom: 8 }}>
            <div>
              <h2>Change password</h2>
              <p>You need your current one.</p>
            </div>
          </div>
          <AccountWorkspace />
        </section>

        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>{isStaff ? "Recent orders" : "Your orders"}</h2>
              <p>{isStaff ? "Latest across the store" : "Orders placed while signed in"}</p>
            </div>
            {user.role === "admin" && (
              <Link href="/admin/orders" className="portal-btn">All orders</Link>
            )}
          </div>

          {/* The storefront layout owns the cart provider; this page is in the
              portal tree, so it mounts its own around the reorder buttons. Both
              read and write the same stored cart. */}
          {recent.length === 0 ? (
            <p className="crm-empty">
              {isStaff
                ? "No orders yet."
                : "No orders yet. Anything you order while signed in shows up here."}
            </p>
          ) : (
            <CartProvider>
            <table className="portal-table">
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{isStaff ? o.customer.name : when(o.createdAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className="portal-badge">{o.status.replace("_", " ")}</span>
                    </td>
                    {!isStaff && (
                      <td style={{ textAlign: "right" }}>
                        <ReorderButton items={o.items} menu={menu} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            </CartProvider>
          )}

          <p className="portal-muted" style={{ fontSize: 12, marginTop: 12 }}>
            {isStaff
              ? "Store-wide view. Customers see only their own orders here."
              : "Orders placed as a guest are not listed here — track those with the link from your confirmation."}
          </p>
        </section>
      </div>
    </Shell>
  );
}
