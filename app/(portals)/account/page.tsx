import type { Metadata } from "next";
import Link from "next/link";
import PortalShell from "@/components/portal/PortalShell";
import AccountWorkspace from "@/components/portal/AccountWorkspace";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listOrders } from "@/lib/orders/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = (await getCurrentUser())!;
  const orders = await listOrders();

  // Customer accounts do not exist yet — guest orders carry no uid — so staff
  // see the recent order list instead of a personal history.
  const recent = orders.slice(0, 5);

  return (
    <PortalShell
      user={user}
      title="My account"
      subtitle="Your sign-in details and password."
    >
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
              <h2>Recent orders</h2>
              <p>Latest across the store</p>
            </div>
            {user.role === "admin" && (
              <Link href="/admin/orders" className="portal-btn">All orders</Link>
            )}
          </div>

          {recent.length === 0 ? (
            <p className="crm-empty">No orders yet.</p>
          ) : (
            <table className="portal-table">
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.orderNumber}</strong></td>
                    <td>{o.customer.name}</td>
                    <td style={{ textAlign: "right" }}>
                      <span className="portal-badge">{o.status.replace("_", " ")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="portal-muted" style={{ fontSize: 12, marginTop: 12 }}>
            Customer sign-in does not exist yet. Every order on the site is placed as a
            guest and tracked by its own link. Personal order history arrives with
            customer accounts.
          </p>
        </section>
      </div>
    </PortalShell>
  );
}
