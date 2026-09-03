"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ROLES, type Role } from "@/lib/auth/types";
import ActionMenu from "./ActionMenu";
import PortalPasswordInput from "./PortalPasswordInput";

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
  const [resetting, setResetting] = useState<StaffUser | null>(null);
  const [resetPw, setResetPw] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const resetRef = useRef<HTMLDialogElement>(null);
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

  /**
   * Opened from the row menu. window.prompt used to do this — an unstyled
   * native dialog that showed the new password in clear text and blocked the
   * page while it was open.
   */
  async function submitReset(e: React.FormEvent) {
    e.preventDefault();
    if (!resetting) return;
    if (resetPw.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    setResetError(null);
    const ok = await send({ id: resetting.id, password: resetPw }, "PATCH", resetting.id);
    if (ok) {
      setResetting(null);
      setResetPw("");
    }
  }

  useEffect(() => {
    const el = resetRef.current;
    if (!el) return;
    if (resetting && !el.open) el.showModal();
    if (!resetting && el.open) el.close();
  }, [resetting]);

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
              <PortalPasswordInput
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                autoComplete="new-password"
              />
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
                    <td data-label="Name">
                      <strong>{u.name}</strong>
                      {self && <span className="portal-muted"> (you)</span>}
                    </td>
                    <td data-label="Email">{u.email}</td>
                    <td data-label="Role">
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
                    <td data-label="Status">
                      <span className={`portal-badge ${u.disabledAt ? "portal-badge-done" : "portal-badge-packed"}`}>
                        {u.disabledAt ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td data-cell="actions" style={{ textAlign: "right" }}>
                      <ActionMenu
                        label={`Actions for ${u.name}`}
                        actions={[
                          {
                            label: "Reset password",
                            disabled: busy === u.id,
                            onSelect: () => {
                              setResetPw("");
                              setResetError(null);
                              setResetting(u);
                            },
                          },
                          {
                            label: u.disabledAt ? "Enable account" : "Disable account",
                            danger: !u.disabledAt,
                            disabled: self || busy === u.id,
                            title: self ? "You cannot disable your own account" : undefined,
                            onSelect: () =>
                              send({ id: u.id, disabled: !u.disabledAt }, "PATCH", u.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <dialog
        ref={resetRef}
        className="portal-modal"
        aria-labelledby="reset-pw-title"
        onClose={() => setResetting(null)}
        onClick={(e) => {
          if (e.target === resetRef.current) setResetting(null);
        }}
      >
        {resetting && (
          <div className="portal-modal__panel">
            <div className="portal-modal__head">
              <div>
                <h2 id="reset-pw-title">Reset password</h2>
                <p>{resetting.email}</p>
              </div>
              <button
                type="button"
                className="portal-modal__close"
                aria-label="Close"
                onClick={() => setResetting(null)}
              >
                &times;
              </button>
            </div>

            <form className="portal-form" onSubmit={submitReset}>
              {resetError && <p className="portal-note">{resetError}</p>}
              <label>
                New password (min 8 characters)
                <PortalPasswordInput
                  value={resetPw}
                  onChange={setResetPw}
                  autoComplete="new-password"
                />
              </label>
              <p className="portal-muted" style={{ fontSize: 13, margin: 0 }}>
                Tell them the new password yourself — it is not emailed.
              </p>
              <div className="portal-modal__actions">
                <button
                  type="submit"
                  className="portal-btn portal-btn-primary"
                  disabled={busy === resetting.id}
                >
                  {busy === resetting.id ? "Saving…" : "Set password"}
                </button>
                <button type="button" className="portal-btn" onClick={() => setResetting(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </dialog>
    </>
  );
}
