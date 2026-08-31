"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROLES, type Role } from "@/lib/auth/types";

type StaffUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
  disabledAt: string | null;
};

export default function StaffWorkspace({
  users,
  currentUserId,
}: {
  users: StaffUser[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "staff" as Role, password: "" });

  async function send(body: unknown, method: "POST" | "PATCH", key: string) {
    setBusy(key);
    setError(null);
    try {
      const res = await fetch("/api/staff", {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "That did not work.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Could not reach the server.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function addUser(e: React.FormEvent) {
    e.preventDefault();
    const ok = await send(form, "POST", "new");
    if (ok) {
      setForm({ name: "", email: "", role: "staff", password: "" });
      setAdding(false);
    }
  }

  async function resetPassword(u: StaffUser) {
    const next = window.prompt(`New password for ${u.email} (min 8 characters):`);
    if (!next) return;
    await send({ id: u.id, password: next }, "PATCH", u.id);
  }

  return (
    <>
      {error && <p className="portal-note">{error}</p>}

      <div className="crm-toolbar">
        <button type="button" className="portal-btn portal-btn-primary" onClick={() => setAdding((a) => !a)}>
          {adding ? "Cancel" : "Add account"}
        </button>
        <span className="portal-muted" style={{ fontSize: 13 }}>
          {users.length} account{users.length === 1 ? "" : "s"}
        </span>
      </div>

      {adding && (
        <section className="crm-card">
          <div className="crm-card__head">
            <div>
              <h2>New account</h2>
              <p>They can sign in as soon as you save.</p>
            </div>
          </div>
          <form className="portal-form" onSubmit={addUser}>
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Role
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              Password (min 8 characters)
              <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </label>
            <button type="submit" className="portal-btn portal-btn-primary" disabled={busy === "new"}>
              {busy === "new" ? "Saving…" : "Create account"}
            </button>
          </form>
        </section>
      )}

      <section className="crm-card">
        <div className="crm-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const self = u.id === currentUserId;
                return (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      {self && <span className="portal-muted"> (you)</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        disabled={self || busy === u.id}
                        onChange={(e) => send({ id: u.id, role: e.target.value }, "PATCH", u.id)}
                        aria-label={`Role for ${u.name}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className={`portal-badge ${u.disabledAt ? "portal-badge-done" : "portal-badge-packed"}`}>
                        {u.disabledAt ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button type="button" className="portal-btn" onClick={() => resetPassword(u)} disabled={busy === u.id}>
                        Reset password
                      </button>{" "}
                      <button
                        type="button"
                        className="portal-btn"
                        disabled={self || busy === u.id}
                        onClick={() => send({ id: u.id, disabled: !u.disabledAt }, "PATCH", u.id)}
                        title={self ? "You cannot disable your own account" : undefined}
                      >
                        {u.disabledAt ? "Enable" : "Disable"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
