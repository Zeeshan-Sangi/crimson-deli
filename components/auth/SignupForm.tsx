"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FirebaseAuthButtons from "./FirebaseAuthButtons";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [phase, setPhase] = useState<"form" | "verify">("form");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }
      if (data.needsVerification) {
        setPhase("verify");
        setMessage(data.message ?? "Check your email for a verification code.");
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

  if (phase === "verify") {
    return (
      <>
        <p className="auth-footnote" style={{ marginBottom: 16 }}>
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below to finish signing up.
        </p>

        <form className="auth-form" onSubmit={onVerify}>
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
            autoFocus
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
            {busy ? "Verifying…" : "Verify & finish"}
          </button>
        </form>

        <button
          type="button"
          className="auth-submit auth-submit--secondary"
          onClick={onResend}
          disabled={busy}
          style={{ marginTop: 12 }}
        >
          Send a new code
        </button>

        <p className="auth-footnote">
          <button
            type="button"
            className="auth-linkbtn"
            onClick={() => {
              setPhase("form");
              setCode("");
              setError(null);
              setMessage(null);
            }}
          >
            ← Back to sign up
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <FirebaseAuthButtons phoneLayout="full" onError={setError} />

      <div className="auth-divider">
        <span>Or sign up with email</span>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="text"
          className="auth-input"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />

        <input
          type="tel"
          className="auth-input"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
          required
        />

        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          minLength={8}
        />

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-footnote">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
