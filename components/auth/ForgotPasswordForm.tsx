"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not send the reset link.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  // The confirmation never says whether the address had an account — it mirrors
  // what the API is willing to reveal.
  if (sent) {
    return (
      <div className="auth-sent" role="status">
        <p>
          If <strong>{email.trim()}</strong> has an account, a reset link is on its
          way. It expires in an hour.
        </p>
        <p className="auth-sent__hint">
          Nothing in your inbox? Check spam, or{" "}
          <button type="button" className="auth-linkbtn" onClick={() => setSent(false)}>
            try another address
          </button>
          .
        </p>
        <Link href="/login" className="auth-submit auth-submit--link">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="auth-lede">
        Enter the email on your account and we&apos;ll send you a link to choose a
        new password.
      </p>

      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          autoFocus
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Sending…" : "Send reset link"}
        </button>
      </form>
    </>
  );
}
