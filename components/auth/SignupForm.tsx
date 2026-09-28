"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useFormGuard } from "@/components/security/FormGuard";
import { cleanPhoneInput, emailError, phoneError, requiredError } from "@/lib/forms/validate";
import FirebaseAuthButtons from "./FirebaseAuthButtons";
import PasswordInput from "./PasswordInput";

type FieldErrors = { name?: string; phone?: string; email?: string; password?: string };

const RULES: Record<keyof FieldErrors, (v: string) => string | undefined> = {
  name: (v) => requiredError(v, "Please enter your full name."),
  phone: (v) => phoneError(v),
  email: (v) => emailError(v),
  password: (v) =>
    !v ? "Please choose a password." : v.length < 8 ? "Use at least 8 characters." : undefined,
};

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const guard = useFormGuard();

  const [touched, setTouched] = useState<Partial<Record<keyof FieldErrors, boolean>>>({});

  // Checked when a field is left, then live while typing, so the warning shows
  // early and clears as soon as the value is right.
  function recheck(key: keyof FieldErrors, value: string) {
    if (touched[key]) setFieldErrors((f) => ({ ...f, [key]: RULES[key](value) }));
  }

  function leave(key: keyof FieldErrors, value: string) {
    setTouched((t) => ({ ...t, [key]: true }));
    setFieldErrors((f) => ({ ...f, [key]: RULES[key](value) }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setMessage(null);

    const next: FieldErrors = {
      name: RULES.name(name),
      phone: RULES.phone(phone),
      email: RULES.email(email),
      password: RULES.password(password),
    };
    setFieldErrors(next);
    setTouched({ name: true, phone: true, email: true, password: true });
    if (Object.values(next).some(Boolean)) return;
    if (!guard.ready()) {
      setError(guard.captchaPrompt);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, email, password, ...guard.payload() }),
      });
      const data = await res.json().catch(() => ({}));
      guard.reset();
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
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
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

      <form className="auth-form" onSubmit={onSubmit} noValidate>
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
            onChange={(e) => {
              setName(e.target.value);
              recheck("name", e.target.value);
            }}
            onBlur={() => leave("name", name)}
            autoComplete="name"
            required
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <p className="auth-field-error">{fieldErrors.name}</p>}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor={phoneId}>
            Phone number
          </label>
          <input
            id={phoneId}
            type="tel"
            className="auth-input"
            placeholder="2155550123"
            value={phone}
            onChange={(e) => {
              const v = cleanPhoneInput(e.target.value);
              setPhone(v);
              recheck("phone", v);
            }}
            onBlur={() => leave("phone", phone)}
            autoComplete="tel"
            inputMode="numeric"
            required
            aria-invalid={!!fieldErrors.phone}
          />
          {fieldErrors.phone && <p className="auth-field-error">{fieldErrors.phone}</p>}
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
            onChange={(e) => {
              setEmail(e.target.value);
              recheck("email", e.target.value);
            }}
            onBlur={() => leave("email", email)}
            autoComplete="email"
            required
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            recheck("password", v);
          }}
          onBlur={() => leave("password", password)}
          error={fieldErrors.password}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
          minLength={8}
        />

        {guard.fields}

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
