"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyEmailForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not verify that code.");
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  async function onResend() {
    if (busy || !email.trim()) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not send a new code.");
        return;
      }
      setMessage(data.message ?? "A new code is on its way.");
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <p className="auth-footnote" style={{ marginBottom: 16 }}>
        Enter the 6-digit code we sent to your email. It expires in 15 minutes.
      </p>

      <form className="auth-form" onSubmit={onVerify}>
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
        <input
          type="text"
          className="auth-input"
          placeholder="Verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          required
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="auth-footnote" role="status">
            {message}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Verifying…" : "Verify email"}
        </button>
      </form>

      <button
        type="button"
        className="auth-submit auth-submit--secondary"
        onClick={onResend}
        disabled={busy || !email.trim()}
        style={{ marginTop: 12 }}
      >
        Send a new code
      </button>

      <p className="auth-footnote">
        Wrong address? <Link href="/signup">Sign up again</Link> ·{" "}
        <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
