"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DAYS, type Settings } from "@/lib/settings/types";

export default function SettingsWorkspace({
  initial,
  canEdit,
}: {
  initial: Settings;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [s, setS] = useState<Settings>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(s),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not save.");
        return;
      }
      setMsg("Saved.");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  const store = s.store;
  const checkout = s.checkout;

  return (
    <form onSubmit={save}>
      {error && <p className="portal-note">{error}</p>}
      {msg && <p className="portal-note" style={{ background: "#dcfce7", borderColor: "#86efac", color: "#166534" }}>{msg}</p>}

      <div className="crm-grid-2">
        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>Opening hours</h2>
              <p>Orders are refused outside these times, and this is enforced on the server too.</p>
            </div>
          </div>

          <table className="portal-table">
            <tbody>
              {DAYS.map((day) => {
                const h = store.hours[day];
                return (
                  <tr key={day}>
                    <td style={{ textTransform: "capitalize", width: 60 }}>{day}</td>
                    <td>
                      <input
                        type="time"
                        value={h.open}
                        disabled={!canEdit || h.closed}
                        onChange={(e) =>
                          setS({ ...s, store: { ...store, hours: { ...store.hours, [day]: { ...h, open: e.target.value } } } })
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={h.close}
                        disabled={!canEdit || h.closed}
                        onChange={(e) =>
                          setS({ ...s, store: { ...store, hours: { ...store.hours, [day]: { ...h, close: e.target.value } } } })
                        }
                      />
                    </td>
                    <td>
                      <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12 }}>
                        <input
                          type="checkbox"
                          checked={h.closed}
                          disabled={!canEdit}
                          onChange={(e) =>
                            setS({ ...s, store: { ...store, hours: { ...store.hours, [day]: { ...h, closed: e.target.checked } } } })
                          }
                        />
                        Closed
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <div>
          <section className="crm-card">
            <div className="crm-card__head">
              <div>
                <h2>Ordering</h2>
                <p>Pause takes effect immediately.</p>
              </div>
            </div>
            <div className="portal-form">
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={store.ordersPaused}
                  disabled={!canEdit}
                  onChange={(e) => setS({ ...s, store: { ...store, ordersPaused: e.target.checked } })}
                />
                Pause online orders
              </label>
              <label>
                Prep time (minutes)
                <input
                  type="number"
                  min={0}
                  max={240}
                  value={store.prepTimeMinutes}
                  disabled={!canEdit}
                  onChange={(e) => setS({ ...s, store: { ...store, prepTimeMinutes: Number(e.target.value) } })}
                />
              </label>
              <label>
                Timezone
                <input value={store.timezone} disabled readOnly />
              </label>
            </div>
          </section>

          <section className="crm-card">
            <div className="crm-card__head">
              <div>
                <h2>Checkout</h2>
                <p>Tax and tip. Nothing here is hardcoded in the site.</p>
              </div>
            </div>
            <div className="portal-form">
              <label>
                Tax rate, where 0.08 means 8%
                <input
                  inputMode="decimal"
                  value={checkout.taxRate}
                  disabled={!canEdit}
                  onChange={(e) => setS({ ...s, checkout: { ...checkout, taxRate: Number(e.target.value) } })}
                />
              </label>
              <label>
                Tax applies to
                <select
                  value={checkout.taxAppliesTo}
                  disabled={!canEdit}
                  onChange={(e) => setS({ ...s, checkout: { ...checkout, taxAppliesTo: e.target.value as "food" | "all" } })}
                >
                  <option value="food">Fresh food only</option>
                  <option value="all">Everything</option>
                </select>
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={checkout.tipEnabled}
                  disabled={!canEdit}
                  onChange={(e) => setS({ ...s, checkout: { ...checkout, tipEnabled: e.target.checked } })}
                />
                Offer tipping
              </label>
              <label>
                Tip presets (%), comma separated
                <input
                  value={checkout.tipPresets.join(", ")}
                  disabled={!canEdit}
                  onChange={(e) =>
                    setS({ ...s, checkout: { ...checkout, tipPresets: e.target.value.split(",").map((v) => Number(v.trim())).filter((n) => Number.isFinite(n)) } })
                  }
                />
              </label>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={checkout.phoneVerificationRequired}
                  disabled={!canEdit}
                  onChange={(e) => setS({ ...s, checkout: { ...checkout, phoneVerificationRequired: e.target.checked } })}
                />
                Require phone verification (needs an SMS provider)
              </label>
            </div>
          </section>
        </div>
      </div>

      {canEdit && (
        <button type="submit" className="portal-btn portal-btn-primary" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      )}
    </form>
  );
}
