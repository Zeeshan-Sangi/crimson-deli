"use client";

import { useState } from "react";

export default function AccountWorkspace() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);
    if (next !== confirm) {
      setError("The new passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ current, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not change the password.");
        return;
      }
      setMsg("Password changed.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="portal-form" onSubmit={submit}>
      {error && <p className="portal-note">{error}</p>}
      {msg && (
        <p className="portal-note" style={{ background: "#dcfce7", borderColor: "#86efac", color: "#166534" }}>
          {msg}
        </p>
      )}
      <label>
        Current password
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required />
      </label>
      <label>
        New password (min 8 characters)
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" required />
      </label>
      <label>
        Confirm new password
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
      </label>
      <button type="submit" className="portal-btn portal-btn-primary" disabled={busy}>
        {busy ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
