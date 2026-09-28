"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";
import { useFormGuard } from "@/components/security/FormGuard";
import { emailError } from "@/lib/forms/validate";
import FirebaseAuthButtons from "./FirebaseAuthButtons";
import PasswordInput from "./PasswordInput";
import { completeFirebaseSignIn, homeForRole } from "./firebase-session";

export default function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const params = useSearchParams();
  const next = params.get("next") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const guard = useFormGuard();

  async function signInWithFirebaseEmail() {
    if (!isFirebaseClientConfigured()) return false;
    const auth = getClientAuth();
    if (!auth) return false;

    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await result.user.getIdToken();
      const session = await completeFirebaseSignIn(idToken);
      if (!session.ok || !session.user) {
        setError(session.error ?? "Could not sign in.");
        return true;
      }
      router.push(homeForRole(session.user.role, next));
      router.refresh();
      return true;
    } catch {
      return false;
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    const problems = {
      email: emailError(email),
      password: password ? undefined : "Please enter your password.",
    };
    setFieldErrors(problems);
    if (problems.email || problems.password) return;
    if (!guard.ready()) {
      setError(guard.captchaPrompt);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password, ...guard.payload() }),
      });
      const data = await res.json().catch(() => ({}));
      // A token is good for one check, so a failed sign-in needs a fresh tick.
      guard.reset();
      if (!res.ok) {
        if (data.needsVerification && data.email) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }
        if (res.status === 401 && (await signInWithFirebaseEmail())) return;
        setError(data.error ?? "Could not sign in.");
        return;
      }
      router.push(homeForRole(data.user.role, next));
      router.refresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={onSubmit} noValidate>
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
              if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: emailError(e.target.value) }));
            }}
            onBlur={() => email && setFieldErrors((f) => ({ ...f, email: emailError(email) }))}
            autoComplete="username"
            required
            autoFocus
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <p className="auth-field-error">{fieldErrors.email}</p>}
        </div>

        <PasswordInput
          label="Password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setFieldErrors((f) => ({ ...f, password: undefined }));
          }}
          error={fieldErrors.password}
          autoComplete="current-password"
          required
        />

        <div className="auth-forgot">
          <Link href="/forgot-password">Forgot password?</Link>
        </div>

        {guard.fields}

        <button type="submit" className="auth-submit" disabled={busy}>
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>

      <div className="auth-divider">
        <span>Or</span>
      </div>

      <FirebaseAuthButtons next={next} onError={setError} />

      {error && (
        <p className="auth-error auth-error--below" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
