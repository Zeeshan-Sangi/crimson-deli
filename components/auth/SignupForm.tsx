"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import FirebaseAuthButtons from "./FirebaseAuthButtons";
import PasswordInput from "./PasswordInput";

export default function SignupForm() {
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const codeId = useId();
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
          <div className="auth-field">
            <label className="auth-label" htmlFor={codeId}>
              Verification code
            </label>
            <input
              id={codeId}
              type="text"
              className="auth-input"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
            />
          </div>

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
      <FirebaseAuthButtons onError={setError} />

      <div className="auth-divider">
        <span>Or sign up with email</span>
      </div>

      <form className="auth-form" onSubmit={onSubmit}>
        <div className="auth-field">
          <label className="auth-label" htmlFor={nameId}>
            Full name
          </label>
          <input
            id={nameId}
            type="text"
            className="auth-input"
            placeholder="Jane Carter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor={phoneId}>
            Phone number
          </label>
          <input
            id={phoneId}
            type="tel"
            className="auth-input"
            placeholder="(215) 555-0123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor={emailId}>
            Email address
          </label>
          <input
            id={emailId}
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="At least 8 characters"
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
